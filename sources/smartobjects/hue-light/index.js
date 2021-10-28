import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import Package from './package.json'
import Color from './lib/color'

class Light extends SmartObject {

    constructor(settings,logger,core) {
        let configuration = require('./configuration.json')
        super(settings,logger,core,configuration)
    }


    /*
        Action
    */
    async __turnOn(settings = {}) {
        let color = settings.color ? Color.isHexColor(settings.color.slice(1,Infinity))   ? settings.color : "#ffffff" : "#ffffff"
        var r = parseInt(color.substr(1,2), 16)
        var g = parseInt(color.substr(3,2), 16)
        var b = parseInt(color.substr(5,2), 16)
        let hsl = Color.rgbToHsl(r,g,b)
        var hue = parseInt(((Color.rgbToHsl(r, g, b)[0] * 360) * 65535) / 360);
        let sat = parseInt(hsl[1] * 255)
        let bri = parseInt(hsl[2] * 255)
        let result = await fetch("http://" + this.settings.path + "/api/" + this.settings.apikey + "/lights/" + this.settings.id + "/state", {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                on: true,
                hue: hue,
                sat: sat,
                transitiontime: settings.transitiontime * 10,
                bri: parseInt(settings.brightness ? settings.brightness : bri)
            })
        })
        if(result.status == 200) {
            let resultJSON = await result.json()
            let error = {
                error: false,
                type: "",
                description: ""
            }
            if (Array.isArray(resultJSON)) {
                for (let index = 0; index < resultJSON.length; index++) {
                    let item = resultJSON[index];
                    if (item.error) {
                        error = {
                            error: true,
                            type: item.error.type,
                            message: item.error.description
                        }
                    }
                }
            }
            if (error.error) {
                return {
                    error: true,
                    code: Package.name + ">turnOn>invalidRequest>" + error.message,
                    message: "Invalid request " + error.message
                }
            } else {
                return {
                    error: false,
                    code: "ok",
                    message: "",
                    data: resultJSON
                }
            }
        } else {
            return {
                error: true,
                code: Package.name + ">turnOn>invalidStatus>" + result.status,
                message: "Invalid status " + result.status
            }
        }
    }

    async __turnOff(settings = {}) {
        let result = await fetch("http://" + this.settings.path + "/api/" + this.settings.apikey + "/lights/" + this.settings.id + "/state", {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                on: false
            })
        })
        if(result.status == 200) {
            let resultJSON = await result.json()
            let error = {
                error: false,
                type: "",
                message: ""
            }
            if (Array.isArray(resultJSON)) {
                for (let index = 0; index < resultJSON.length; index++) {
                    let item = resultJSON[index];
                    if (item.error) {
                        error = {
                            error: true,
                            type: item.error.type,
                            message: item.error.description
                        }
                    }
                }
            }
            if (error.error) {
                return {
                    error: true,
                    code: Package.name + ">turnOff>invalidRequest>" + error.message,
                    message: "Invalid request " + error.message
                }
            } else {
                return {
                    error: false,
                    code: "ok",
                    message: "",
                    data: resultJSON
                }
            }
        } else {
            return {
                error: true,
                code: Package.name + ">turnOff>invalidStatus>" + result.status,
                message: "Invalid status " + result.status
            }
        }
    }

    async __getState(settings = {}) {
        let result = await fetch("http://" + this.settings.path + "/api/" + this.settings.apikey + "/lights/" + this.settings.id )
        if(result.status == 200) {
            let resultJSON = await result.json()
            if (Array.isArray(resultJSON)) {
                let item = resultJSON[0].error
                return {
                    error: true,
                    code: Package.name + ">getState>invalidRequest>" + item,
                    message: "Invalid request " + item
                }
            } else {
                return {
                    error: false,
                    code: "ok",
                    message: "",
                    data: resultJSON
                }
            }
        } else {
            return {
                error: true,
                code: Package.name + ">getState>invalidStatus>" + result.status,
                message: "Invalid status " + result.status
            }
        }
    }

}

export default Light