import Package from '../package'
import md5 from 'md5'

class Modules {

    constructor(core) {
        this.core = core
        this.connector = core.connector
        this.logger = core.logger
        this.installModules = []
        this.modules = new Map()
    }

    restart() {
        try {
            this.logger.verbose(Package.name, "Module manager : restart")
            this.modules = new Map()
            this.installModules.forEach(async pModule => {
                let Module = require(pModule)
                let instanceModule = new Module(this.core)
                this.modules.set(pModule, instanceModule)
                this.logger.verbose(Package.name, "Module manager : instanciate module " + pModule + " successful")
            })
        } catch (error) {
            this.core.logger.error("Module manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    getByHash(hash) {
        let find = false
        this.installModules.forEach(pModule => {
            if (md5(pModule) == hash) {
                this.logger.verbose(Package.name, "Module manager : find hash module " + hash + " as " + pModule)
                find = pModule
            }
        })
        return find
    }

    async executeAction(tool, action, settings) {
        try {
            if (this.modules.has(tool)) {
                let mTool = this.modules.get(tool)
                if (typeof mTool["__" + action] === "function") {
                    return await mTool["__" + action](settings)
                } else {
                    return {
                        error: true,
                        package: Package.name,
                        message: 'Action not found'
                    }
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: 'Module not found'
                }
            }
        } catch (error) {
            this.core.logger.error("Module manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    getAll() {
        try {
            let modules = []
            this.installModules.forEach(pModule => {
                try {
                    let configuration = require(pModule + "/package.json")
                    modules.push(configuration)
                } catch (error) {
                    this.core.logger.error(Package.name, "Module manager : inaccessible configuration from module " + pModule)
                    this.core.logger.error(Package.name, JSON.stringify(error.toString()))
                }
            })
            return {
                error: false,
                package: Package.name,
                message: '',
                data: modules
            }
        } catch (error) {
            this.core.logger.error("Module manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }
}


export default Modules