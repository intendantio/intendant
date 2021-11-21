import Package from './package.json'

class SmartObject {

    constructor(settings, core, moduleConfiguration) {
        this.moduleConfiguration = moduleConfiguration
        this.settings = settings
        this.id = settings._id
        this.logger = core.logger
        this.core = core
        this.moduleConfiguration.settings.map(setting => {
            if (this.settings[setting.id] == undefined || this.settings[setting.id] == null) {
                throw Package.name + ">Missing settings>" + this.id  + "-" + setting.id
            }
        })
    }

    async action(action, settings) {
        this.logger.verbose(Package.name,"Execute " + action)
        if (this["__" + action]) {
            try {
                this.core.controller.smartobject.updateLastUse(this.id)
                return await this["__" + action](settings)
            } catch (error) {
                let message = "An error has occurred when " + action + " '" + JSON.stringify(error.toString()).slice(0, 100) + "'"
                this.logger.warning(Package.name, message)
                return {
                    error: true,
                    package: Package.name,
                    message: message
                }
            }
        } else {
            this.logger.warning(Package.name, "Action not found " + action)
            return {
                error: true,
                package: Package.name,
                message: "Action not found '" + action + "'"
            }
        }
    }

}

export default SmartObject