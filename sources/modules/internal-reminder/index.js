import Package from './package.json'
import Moment from 'moment'

class InternalListManager {

    constructor(core) {
        this.core = core
    }

    async __create(settings = {}) {
        settings.flag = Moment().unix()
        return await this.core.controller.storage.setItem(Package.name + "/" + settings.reference,settings)
    }

    async __getOne(settings = {}) {
        let result = await this.core.controller.storage.getItem(Package.name + "/" + settings.reference)
        if(result.error) {
            return result
        } 

        let reminder = result.data

        if(reminder == false) {
            return {
                code: Package.name + ">ReminderNotFound",
                message: "Reminder with reference " + settings.reference + " is not found",
                error: true
            }
        }

        reminder.active = !(reminder.flag  + (reminder.interval * 60 * 60 * 1000) > Moment().unix())
        reminder.action = reminder.active ? reminder.action_active : reminder.action_inactive

        return {
            code: 'ok',
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
                code: Package.name + ">ReminderNotFound",
                message: "Reminder with reference " + settings.reference + " is not found",
                error: true
            }
        }
        reminder.flag = Moment().unix()
        return await this.core.controller.storage.setItem(Package.name + "/" + settings.reference,reminder)
    }

}

export default InternalListManager