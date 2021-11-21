import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import Package from './package.json'
import Https from 'https'

const httpsAgent = new Https.Agent({
    rejectUnauthorized: false,
})

class Plug extends SmartObject {

    constructor(settings, logger, core) {
        super(settings, logger, core, Package)
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
    async __turnOn(settings = {}) {
        let resultHue = this.getHueSettings()
        if(resultHue.error) {
            return resultHue
        }
        let result = await fetch("https://" + resultHue.data.path + "/clip/v2/resource/light/" + this.settings.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'hue-application-key': resultHue.data.apikey
            },
            agent: httpsAgent,
            body: JSON.stringify({
                on: {
                    on: true
                }
            })
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

    async __turnOff(settings = {}) {
        let resultHue = this.getHueSettings()
        if(resultHue.error) {
            return resultHue
        }
        let result = await fetch("https://" + resultHue.data.path + "/clip/v2/resource/light/" + this.settings.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'hue-application-key': resultHue.data.apikey
            },
            agent: httpsAgent,
            body: JSON.stringify({ on: { on: false } })
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
        let resultHue = this.getHueSettings()
        if(resultHue.error) {
            return resultHue
        }
        let result = await fetch("https://" + resultHue.data.path + "/clip/v2/resource/light/" + this.settings.id, {
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

}

export default Plug