import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import Package from './package.json'

class Plug extends SmartObject {

    constructor(settings,logger,core) {
        let configuration = require('./configuration.json')
        super(settings,logger,core,configuration)
    }


    /*
        Action
    */
    async __turnOn(settings = {}) {
        let result = await fetch(this.settings.path + this.settings.apikey + "/lights/" + this.settings.id + "/state", {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                on: true
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
        let result = await fetch(this.settings.path + this.settings.apikey + "/lights/" + this.settings.id + "/state", {
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
        let result = await fetch(this.settings.path + this.settings.apikey + "/lights/" + this.settings.id)
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

export default Plug