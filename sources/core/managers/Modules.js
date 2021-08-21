import Package from '../package'
import md5 from 'md5'

class Modules {

    constructor(core) {
        this.core = core
        this.connector = core.connector
        this.logger = core.logger
        this.configuration = core.configuration
        this.logger.verbose(Package.name, "Start Module Manager")
        this.modules = new Map()
        this.configuration.modules.forEach(async pModule => {
            this.logger.verbose(Package.name, "Module " + pModule + " has installed")
            let Module = require(require('path').resolve('./') + "/.intendant/" + pModule)
            let instanceModule = new Module(this.core)
            this.modules.set(pModule, instanceModule)
        })
    }

    restart() {
        this.logger.verbose(Package.name, "Restart Module Manager")
        this.modules = new Map()
        this.configuration.modules.forEach(async pModule => {
            this.logger.verbose(Package.name, "Module " + pModule + " has installed")
            let Module = require(require('path').resolve('./') + "/.intendant/" + pModule)
            let instanceModule = new Module(this.core)
            this.modules.set(pModule, instanceModule)
        })
    }

    getByHash(hash) {
        let find = false
        this.configuration.modules.forEach(pModule => {
            if (md5(pModule) == hash) {
                find = pModule
            }
        })
        return find
    }

    async executeAction(tool, action, settings) {
        if (this.modules.has(tool)) {
            let mTool = this.modules.get(tool)
            if (typeof mTool["__" + action] === "function") {
                return await mTool["__" + action](settings)
            } else {
                return {
                    error: true,
                    code: Package.name + ' > ModuleManager > executeAction > action not found',
                    message: 'Action not found'
                }
            }
        } else {
            return {
                error: true,
                code: Package.name + ' > ModuleManager > executeAction > module not found',
                message: 'Module not found'
            }
        }
    }

    getAll() {
        this.core.logger.verbose(Package.name, "Get all modules")
        let modules = []
        this.configuration.modules.forEach(pModule => {
            try {
                let configuration = require(require('path').resolve('./') + "/.intendant/" + pModule + "/configuration.json")
                modules.push(configuration)
            } catch (error) {
                this.core.logger.error(Package.name, "Impossible get configuration in " + pModule + " module")
                this.core.logger.error(Package.name, JSON.stringify(error.toString()))
            }
        })
        return {
            error: false,
            code: 'ok',
            message: '',
            data: modules
        }
    }
}


export default Modules