import Package from './package.json'
import Moment from 'moment'
import Schedule from 'node-schedule'

class Reminder {

    constructor(core) {
        this.core = core
        this.prepare()
    }

    async prepare() {
        let result = await this.core.controller.storage.getItem(Package.name)
        if(result.error) {
            this.core.logger.warning(Package.name, result.message )
        } else {
            if(result.data == false) {
                await this.core.controller.storage.setItem(Package.name,[])
            } else if(Array.isArray(result.data)) {
                result.data.forEach(data => {
                    this.instanciate(data)
                })
            } else {
                await this.core.controller.storage.setItem(Package.name,[])
            }
        }
    }

    instanciate(data) {
        this.core.logger.verbose(Package.name, "Instanciate " + data.reference + " at cron " + data.cron)
        this["job-" + data.reference] = Schedule.scheduleJob(data.cron,async () => {
            this.core.logger.verbose(Package.name, "Execution job " + data.reference)
            if(data.repeating == false) { 
                this["job-" + data.reference].cancel() 
            }
            let result = await this.core.controller.client.getAll()
            let tokens = result.data.map(data => data.token)
            await this.core.controller.notification.notify("Intendant",data.information, tokens)
        })
        return {
            error: false,
            package: Package.name,
            message: ""
        }
    }

    async __create(settings = {}) {
        try {
            if(typeof settings.reference == 'string' && typeof settings.information == "string" && typeof settings.cron == "string" && typeof settings.repeating == 'boolean') {
                let result = await this.core.controller.storage.getItem(Package.name)
                if(result.error) {
                    return result
                } else {
                    result.data.push(settings)
                    await this.core.controller.storage.setItem(Package.name, result.data)
                    return this.instanciate(settings)
                }
            } else {
                this.core.logger.warning(Package.name, "Missing is settings")
                return {
                    error: true,
                    package: Package.name,
                    message: "Missing is settings"
                }
            }
        } catch (error) {
            this.core.logger.warning(Package.name, error.toString() )
            return {
                error: true,
                package: Package.name,
                message: "Throw exception"
            }
        }
    }

    async __getOne(settings = {}) {
        let result = await this.core.controller.storage.getItem(Package.name + "/" + settings.reference)
        if(result.error) {
            return result
        } 
        let reminder = result.data
        if(reminder == false) {
            return {
                package: Package.name,
                message: "Reminder with reference " + settings.reference + " is not found",
                error: true
            }
        }
        return {
            package: Package.name,
            message: "",
            error: false,
            data: reminder
        }
    }
}

export default Reminder