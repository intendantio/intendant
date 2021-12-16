import Package from '../package'
import Tracing from '../utils/Tracing'
import md5 from 'md5'
import fetch from 'node-fetch'
import fs from 'fs'

class Modules {

    constructor(core) {
        this.core = core
        this.installModules = []
        this.modules = new Map()
        this.before()
    }

    async before() {
        let resultMarket = await fetch("https://market.intendant.io")
            let resultMarketJSON = await resultMarket.json()
            resultMarketJSON = resultMarketJSON.filter(item => {
                return item.name.includes("-module")
            })
            resultMarketJSON.forEach(pModule => {
                if(fs.existsSync("./node_modules/" + pModule.name)) {
                    this.installModules.push(pModule.name)
                }
            })
            this.restart()
    }

    restart() {
        try {
            Tracing.verbose(Package.name, "Module manager : restart")
            this.modules = new Map()
            this.installModules.forEach(async pModule => {
                try {
                    let Module = require(pModule)
                    let instanceModule = new Module(this.core)
                    this.modules.set(pModule, instanceModule)
                    Tracing.verbose(Package.name, "Module manager : instanciate module " + pModule + " successful")
                } catch (error) {
                    this.installModules = this.installModules.filter(installModule => {
                        return installModule != pModule
                    })
                }
            })
        } catch (error) {
            Tracing.error("Module manager : " + error.toString())
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
                Tracing.verbose(Package.name, "Module manager : find hash module " + hash + " as " + pModule)
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
            Tracing.error("Module manager : " + error.toString())
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
                    Tracing.error(Package.name, "Module manager : inaccessible configuration from module " + pModule)
                    Tracing.error(Package.name, JSON.stringify(error.toString()))
                }
            })
            return {
                error: false,
                package: Package.name,
                message: '',
                data: modules
            }
        } catch (error) {
            Tracing.error("Module manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }
}


export default Modules