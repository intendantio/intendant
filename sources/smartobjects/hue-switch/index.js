import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import Package from './package.json'
import Moment from 'moment'

class HueSwitch extends SmartObject {

    constructor(settings,logger,core) {
        let configuration = require('./configuration.json')
        super(settings,logger,core,configuration)
    }

    /*
        Action
    */

    async __getState(settings = {}) {
        let result = await fetch(this.settings.path + this.settings.apikey + "/sensors/" + this.settings.id)
        if(result.status == 200) {
            let resultJSON = await result.json()
            if (Array.isArray(resultJSON)) {
                let item = resultJSON.length == 0 ? "" : resultJSON[0].error
                this.logger.warning(this.key, "/checkState - error code " + item.type + " return")
                return {
                    error: true,
                    code: Package.name + ">getState>invalidRequest>error" ,
                    message: "Invalid request " + item
                }
            } else {
                try {
                    let idEvent = resultJSON.state.buttonevent
                    let dateEventUTC = resultJSON.state.lastupdated
                    let dateEvent = Moment.utc(dateEventUTC).format()
                    let lastEvent = {}
                    let now = Moment(new Date().toISOString()).utc()
                    let difference = now.diff(dateEvent, 'seconds')
                    resultJSON.capabilities.inputs.forEach(input => {
                        input.events.forEach(event => {
                            if(event.buttonevent == idEvent) {
                                lastEvent = event
                            }
                        })
                    })
                    return {
                        error: false,
                        code: "ok",
                        message: "",
                        data: {
                            event: lastEvent.buttonevent ? lastEvent.buttonevent : -1,
                            type: lastEvent.eventtype ?  lastEvent.eventtype : "",
                            lastEvent: difference
                        }
                    }
                } catch (error) {
                    return {
                        error: true,
                        code: Package.name + ">getState>invalidResult",
                        message: "Invalid result"
                    }
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

    async __getConfiguration(settings = {}) {
        let result = await fetch(this.settings.path + this.settings.apikey + "/sensors/" + this.settings.id)
        if(result.status == 200) {
            let resultJSON = await result.json()
            if (Array.isArray(resultJSON)) {
                let item = resultJSON.length == 0 ? "" : resultJSON[0].error
                this.logger.warning(this.key, "/checkState - error code " + item.type + " return")
                return {
                    error: true,
                    code: Package.name + ">getConfiguration>invalidRequest>error" ,
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
                code: Package.name + ">getConfiguration>invalidStatus>" + result.status,
                message: "Invalid status " + result.status
            }
        }
    }

}

export default HueSwitch