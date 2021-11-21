import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import Package from './package.json'
import Https from 'https'
import Moment from 'moment'

const httpsAgent = new Https.Agent({
    rejectUnauthorized: false,
})



class HueSwitch extends SmartObject {

    constructor(settings, logger, core) {
        super(settings, logger, core, Package)
        this.currentState = {
            button: {
                last_event: ""
            }
        }
        setTimeout(() => {
            this.initialisation()
        },5000)
    }

    initialisation() {
        this.logger.verbose(Package.name,"Initialisation")
        if(this.core.manager.smartobject.smartobjects.has(parseInt(this.settings.hueBridge))) {
            let hueBridge = this.core.manager.smartobject.smartobjects.get(parseInt(this.settings.hueBridge))
            hueBridge.listener[this.settings.id] = (data) => {
                this.logger.verbose(Package.name,"Update state smartobject " + this.settings.id)
                this.currentState = data
            }
        }
    }

    getHueSettings() {
        if(this.core.manager.smartobject.smartobjects.has(parseInt(this.settings.hueBridge))) {
            return {
                error: false,
                package: Package.name,
                data: this.core.manager.smartobject.smartobjects.get(parseInt(this.settings.hueBridge)).settings,
                message: ""
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Missing smartobject instance " + this.settings.hueBridge
            }
        }
    }

    /*
        Action
    */

    async __configuration(settings = {}) {
        let resultHue = this.getHueSettings()
        if(resultHue.error) {
            return resultHue
        }
        let result = await fetch("https://" + resultHue.data.path + "/clip/v2/resource/button/" + this.settings.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'hue-application-key': resultHue.data.apikey
            },
            agent: httpsAgent
        })
        if (result.status == 200) {
            let resultJSON = await result.json()
            if(resultJSON.errors.length > 0) {
                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid request " + JSON.stringify(resultJSON.errors)
                }
            } else {
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: resultJSON.data[0]
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Invalid status " + result.status
            }
        }
    }


    async __state(settings = {}) {
        let state = {
            long_release: "long",
            short_release: "short"
        }
        if(state[this.currentState.button.last_event] == settings.type) {
            let dateEvent = Moment.utc(this.currentState.creationtime).format()
            let now = Moment(new Date().toISOString()).utc()
            let duration = now.diff(dateEvent, 'seconds')
            if(duration < settings.duration) {
                return {
                    error: false,
                    package: Package.name,
                    data: {
                        reason: "",
                        state: true
                    }
                }
            } else {
                return {
                    error: false,
                    package: Package.name,
                    data: {
                        reason: "duration too long",
                        state: false
                    }
                }
            }
        } else {
            return {
                error: false,
                package: Package.name,
                data: {
                    reason: "type invalid",
                    state: false
                }
            }
        }
    }

}

export default HueSwitch