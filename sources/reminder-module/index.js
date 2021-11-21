import Package from './package.json'
import Moment from 'moment'
import Schedule from 'node-schedule'

class InternalListManager {

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
        this.job = Schedule.scheduleJob(data.cron,async () => {
            
        })
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

        reminder.active = !(reminder.flag  + (reminder.interval * 60 * 60 * 1000) > Moment().unix())
        reminder.action = reminder.active ? reminder.action_active : reminder.action_inactive

        return {
            package: Package.name,
            message: "",
            error: false,
            data: reminder
        }
    }

    async __update(settings = {}) {
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
        reminder.flag = Moment().unix()
        return await this.core.controller.storage.setItem(Package.name,reminder)
    }

}

export default InternalListManager