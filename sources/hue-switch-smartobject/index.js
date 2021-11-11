import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import Package from './package.json'
import Moment from 'moment'

class HueSwitch extends SmartObject {

    constructor(settings, logger, core) {
        super(settings, logger, core, Package)
    }

    /*
        Action
    */

    async request() {
        let result = await fetch("http://" + this.settings.path + "/api/" + this.settings.apikey + "/sensors/" + this.settings.id)
        if (result.status == 200) {
            let resultJSON = await result.json()
            if (Array.isArray(resultJSON)) {
                this.core.logger.warning(Package.name, "Invalid request")
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
            this.core.logger.warning(Package.name, "Invalid status")
            return {
                error: true,
                package: Package.name,
                message: "Invalid status"
            }
        }
    }

    async __event(settings = {}) {
        let result = await this.request()
        if(result.error) {
            return result
        }
        try {
            let idEvent = result.data.state.buttonevent
            let dateEventUTC = result.data.state.lastupdated
            let dateEvent = Moment.utc(dateEventUTC).format()
            let lastEvent = {}
            let now = Moment(new Date().toISOString()).utc()
            let difference = now.diff(dateEvent, 'seconds')
            result.data.capabilities.inputs.forEach(input => {
                input.events.forEach(event => {
                    if (event.buttonevent == idEvent) {
                        lastEvent = event
                    }
                })
            })
            return {
                error: false,
                package: Package.name,
                message: "",
                data: {
                    event: lastEvent.buttonevent ? lastEvent.buttonevent : -1,
                    type: lastEvent.eventtype ? lastEvent.eventtype : "",
                    lastEvent: difference
                }
            }
        } catch (error) {
            this.core.logger.warning(Package.name, error.toString())
            return {
                error: true,
                package: Package.name,
                message: "Invalid result"
            }
        }
    }

    async __configuration(settings = {}) {
        return this.request()
    }

    async __state(settings = {}) {
        if(settings.event == undefined) {
            this.core.logger.warning(Package.name, "Event is missing")
            return {
                error: true,
                package: Package.name,
                message: "Event is missing"
            }
        } 
        if(settings.type == undefined) {
            this.core.logger.warning(Package.name, "Type is missing")
            return {
                error: true,
                package: Package.name,
                message: "Type is missing"
            }
        }
        if(settings.duration == undefined) {
            this.core.logger.warning(Package.name, "Duration is missing")
                return {
                    error: true,
                    package: Package.name,
                    message: "Duration is missing"
                }
        }

        let result = await this.__event({})
        if(result.error) {
            return result
        }
        let event = result.data
        if(settings.type == event.type) {
            if(event.event.toString()[0] == settings.event) {
                if(parseInt(settings.duration) > event.lastEvent) {
                    return {
                        error: false,
                        package: Package.name,
                        data: {
                            reason: "",
                            state:true
                        }
                    }
                } else {
                    return {
                        error: false,
                        package: Package.name,
                        data: {
                            reason: "duration too long",
                            state:false
                        }
                    }
                }
            } else {
                return {
                    error: false,
                    package: Package.name,
                    data: {
                        reason: "event invalid",
                        state:false
                    }
                }
            }
        } else {
            return {
                error: false,
                package: Package.name,
                data: {
                    reason: "type invalid",
                    state:false
                }
            }
        }
    }

}

export default HueSwitch