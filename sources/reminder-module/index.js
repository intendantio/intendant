import Package from './package.json'
import Schedule from 'node-schedule'

class Reminder {

    constructor(core) {
        this.core = core
        this.instances = new Map()
        this.prepare()
    }

    async prepare() {
        let result = await this.core.controller.storage.getItem(Package.name)
        if (result.error) {
            this.core.logger.warning(Package.name, result.message)
            await this.clear()
        } else {
            if (Array.isArray(result.data)) {
                result.data.forEach(data => {
                    this.instanciate(data)
                })
            } else {
                await this.clear()
            }
        }
    }

    async deleteOne(reference) {
        let storage = await this.core.controller.storage.getItem(Package.name)
        storage.data = storage.data.filter(item => {
            return item.reference != reference
        })
        await this.core.controller.storage.setItem(Package.name, storage.data)
    }

    async clear() {
        this.instances = new Map()
        await this.core.controller.storage.setItem(Package.name, [])
    }

    instanciate(data) {
        if (this.instances.has(data.reference)) {
            this.core.logger.warning(Package.name, "Already instanciate job " + data.reference)
            return {
                error: true,
                package: Package.name,
                message: "Already instanciate job " + data.reference
            }
        } else {
            this.core.logger.verbose(Package.name, "Instanciate " + data.reference)
            this["job-" + data.reference] = Schedule.scheduleJob(data.cron, async () => {
                this.core.logger.verbose(Package.name, "Execution job " + data.reference)
                if (data.repeating == false) {
                   await this.__removeOne(data)
                }
                let result = await this.core.controller.client.getAll()
                await this.core.controller.notification.notify("Intendant", data.information, result.data.map(data => data.token))
            })
            if (this["job-" + data.reference] == null) {
                this.core.logger.warning(Package.name, "Invalid Cron value " + data.cron)
                this.deleteOne(data.reference)
                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid cron value " + data.cron
                }
            } else {
                this.instances.set(data.reference, true)
                return {
                    error: false,
                    package: Package.name,
                    message: ""
                }
            }
        }

    }

    async __create(settings = {}) {
        try {
            if (typeof settings.reference == 'string' && typeof settings.information == "string" && typeof settings.cron == "string") {
                settings.repeating = settings.repeating ? settings.repeating : false
                let result = await this.core.controller.storage.getItem(Package.name)
                if (result.error) {
                    return result
                } else {
                    if (this.instances.has(settings.reference)) {
                        this.core.logger.warning(Package.name, "Already exist job " + data.reference)
                        return {
                            error: true,
                            package: Package.name,
                            message: "Already exist job " + data.reference
                        }
                    } else {
                        result.data.push(settings)
                        await this.core.controller.storage.setItem(Package.name, result.data)
                        return this.instanciate(settings)
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "Missing parameters")
                return {
                    error: true,
                    package: Package.name,
                    message: "Missing parameters"
                }
            }
        } catch (error) {
            this.core.logger.warning(Package.name, error.toString())
            return {
                error: true,
                package: Package.name,
                message: "Throw exception"
            }
        }
    }
    async __getOne(settings = {}) {
        let result = await this.core.controller.storage.getItem(Package.name)
        if (result.error) {
            return result
        }
        let reminders = result.data
        let reminder = false
        reminders.forEach(pReminder => {
            if(pReminder.reference == settings.reference) {
                reminder = pReminder
            }
        })
        if (reminder == false) {
            return {
                package: Package.name,
                message: "Reminder " + settings.reference + " not found",
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

    async __getAll(settings = {}) {
        return await this.core.controller.storage.getItem(Package.name)
    }

    async __removeOne(settings = {}) {
        try {
            if (this.instances.has(settings.reference)) {
                if(typeof this["job-" + settings.reference] == 'object') {
                    this["job-" + settings.reference].cancel()
                }
                this.deleteOne(settings.reference)
                this.instances.delete(settings.reference)
                this.core.logger.verbose(Package.name, "Remove job " + settings.reference)
                return {
                    error: false,
                    package: Package.name,
                    message: ""
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: "Reminder not found"
                }
            }
        } catch (error) {
            let message = Package.name + " " + JSON.stringify(error.toString())
            this.core.logger.error(Package.name, message)
            return {
                error: true,
                package: Package.name,
                message: "Internal error server : " + JSON.stringify(error.toString())
            }
        }
    }
}

export default Reminder