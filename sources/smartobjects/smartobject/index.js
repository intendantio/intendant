import Package from './package.json'

class SmartObject {

    constructor(settings, core, moduleConfiguration) {
        this.moduleConfiguration = moduleConfiguration
        this.settings = settings
        this.id = settings._id
        this.logger = core.logger
        this.core = core
        this.moduleConfiguration.settings.map(setting => {
            if (typeof this.settings[setting.id] != setting.type) {
                throw Package.name + ">Missing settings>" + setting.id
            }
        })
    }

    async action(action, settings) {
        if (this["__" + action]) {
            try {
                this.core.controller.smartobject.updateLastUse(this.id)
                return await this["__" + action](settings)
            } catch (error) {
                let message = "An error has occurred when " + action + " '" + JSON.stringify(error.toString()).slice(0, 100) + "'"
                this.logger.warning(Package.name, message)
                return {
                    error: true,
                    code: Package.name + ">Error>" + action,
                    message: message
                }
            }
        } else {
            this.logger.warning(Package.name, "Action not found " + action)
            return {
                error: true,
                code: Package.name + ">Action>NotFound>" + action,
                message: "Action not found '" + action + "'"
            }
        }
    }

    async __test(settings) {
        if (settings.throw) {
            throw "test-error"
        }
        return {
            code: 'ok',
            data: {},
            error: false,
            message: settings.message
        }
    }

}

export default SmartObject