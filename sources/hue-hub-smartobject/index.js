import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import Package from './package.json'
import Https from 'https'
import Color from './lib/color'

const httpsAgent = new Https.Agent({
    rejectUnauthorized: false,
})


class Hub extends SmartObject {

    constructor(settings, logger, core) {
        super(settings, logger, core, Package)
        this.updateState()
        this.listener = {}
    }

    async updateState() {
        this.core.logger.verbose(Package.name, "Long polling")
        let result = await fetch("https://" + this.settings.path + "/eventstream/clip/v2", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'hue-application-key': this.settings.apikey
            },
            agent: httpsAgent
        })
        if (result.status == 200) {
            let resultJSON = await result.json()
            let data = resultJSON[0]
            data.data.forEach(pData => {
                if(typeof this.listener[pData.id] == 'function') {
                    pData.creationtime = data.creationtime
                    this.listener[pData.id](pData)
                }
            })
        }
        
        setTimeout(() => {
            this.updateState()
        },500)
    }

    /*
        Action
    */
    async __turnOn(settings = {}) {
        let color = settings.color ? Color.isHexColor(settings.color.slice(1, Infinity)) ? settings.color : "#ffffff" : "#ffffff"
        let position = Color.hexToLab(color)
        if(settings.duration == undefined) {
            settings.duration = 200
        }
        if(settings.brightness == undefined) {
            settings.brightness = 70
        }
        let body = {
            on: {
                on: true
            },
            dimming: {
                brightness: parseInt(settings.brightness),
            },
            color: {
                xy: {
                    x: position.x,
                    y: position.y
                }
            },
            dynamics: {
                duration: parseInt(settings.duration)
            }
        }
        let result = await fetch("https://" + this.settings.path + "/clip/v2/resource/light/" + this.settings.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'hue-application-key': this.settings.apikey
            },
            agent: httpsAgent,
            body: JSON.stringify(body)
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
        if(settings.duration == undefined) {
            settings.duration = 200
        }
        let body = { 
            on: { on: false },
            dynamics: { duration: parseInt(settings.duration) }
        }
        let result = await fetch("https://" + this.settings.path + "/clip/v2/resource/light/" + this.settings.id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'hue-application-key': this.settings.apikey
            },
            agent: httpsAgent,
            body: JSON.stringify(body)
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
        let result = await fetch("https://" + this.settings.path + "/clip/v2/resource/light/" + this.settings.id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'hue-application-key': this.settings.apikey
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

export default Hub