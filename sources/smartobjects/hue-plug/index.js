import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import Package from './package.json'

class Plug extends SmartObject {

    constructor(settings, logger, core) {
        let configuration = require('./configuration.json')
        super(settings, logger, core, configuration)
    }

    /*
        Action
    */
    async __turnOn(settings = {}) {
        let result = await fetch("http://" + this.settings.path + "/api/" + this.settings.apikey + "/lights/" + this.settings.id + "/state", {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ on: true })
        })
        if (result.status == 200) {
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
                    package: Package.name,
                    message: "Invalid request"
                }
            } else {
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: resultJSON
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Invalid status"
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
            body: JSON.stringify({ on: false })
        })
        if (result.status == 200) {
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
                    package: Package.name,
                    message: "Invalid request"
                }
            } else {
                return {
                    error: false,
                    message: "",
                    package: Package.name,
                    data: resultJSON
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Invalid status"
            }
        }

    }

    async __configuration(settings = {}) {
        let result = await fetch("http://" + this.settings.path + "/api/" + this.settings.apikey + "/lights/" + this.settings.id)
        if (result.status == 200) {
            let resultJSON = await result.json()
            if (Array.isArray(resultJSON)) {
                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid request"
                }
            } else {
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: resultJSON
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Invalid status"
            }
        }
    }

}

export default Plug