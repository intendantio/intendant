import Package from '../package'
import Tracing from '../utils/Tracing'
import StackTrace from '../utils/StackTrace'
import Result from '../utils/Result'
import md5 from 'md5'
import fetch from 'node-fetch'
import fs from 'fs'

class ModulesManager {

    constructor(core) {
        this.core = core

        /* Private */
        this._packages = []
        this._instances = new Map()

        this.before()
    }

    

    async before() {
        try {
            Tracing.verbose(Package.name, "Start module manager")
            let resultMarket = await fetch("https://market.intendant.io")
            let resultMarketJSON = await resultMarket.json()
            resultMarketJSON.filter(pModule => {
                return pModule.type == "module" && fs.existsSync("./node_modules/" + pModule.name)
            }).forEach(pModule => {
                this._packages.push(pModule.name)
            })
            return this.restart()
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when executing before function")
            return new Result(Package.name, true, "Error occurred when executing before function")
        }
    }

    restart() {
        try {
            this._instances = new Map()
            for (let indexPackage = 0; indexPackage < this._packages.length; indexPackage++) {
                try {
                    let pPackage = this._packages[indexPackage]
                    let Module = require(pPackage)
                    let instanceModule = new Module(this.core, Tracing)
                    this._instances.set(pPackage, instanceModule)
                    Tracing.verbose(Package.name, "Instanciate " + pPackage)
                } catch (error) {
                    StackTrace.save(error)
                    Tracing.error(Package.name, "Error occurred when instanciate " + pPackage)
                    this._packages = this._packages.filter(installModule => {
                        return installModule != pPackage
                    })
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when restart module manager")
            return new Result(Package.name, true, "Error occurred when restart module manager")
        }
    }

    getByHash(hash) {
        let data = false
        this._packages.forEach(pModule => {
            if (md5(pModule) == hash) {
                data = pModule
            }
        })
        return new Result(Package.name, false, "", data)
    }

    async executeAction(name, action, settings) {
        try {
            if (this._instances.has(name)) {
                let pModule = this._instances.get(name)
                if (typeof pModule["__" + action] === "function") {
                    return await pModule["__" + action](settings)
                } else {
                    return new Result(Package.name, true, "Action not found")
                }
            } else {
                return new Result(Package.name, true, "Module not found")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when executing an action in module manager")
            return new Result(Package.name, true, "Error occurred when executing an action in module manager")
        }
    }

    getAll() {
        try {
            let modules = []
            for (let indexPackage = 0; indexPackage < this._packages.length; indexPackage++) {
                let pPackage = this._packages[indexPackage]
                let configuration = require(pPackage + "/package.json")
                modules.push(configuration)
            }
            return new Result(Package.name, false, "", modules)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all configuration in module manager")
            return new Result(Package.name, true, "Error occurred when get all configuration in module manage")
        }
    }

    get packages() {
        return this._packages
    }

    get instances() {
        return this._instances
    }

    set instances(instances) {
        this._instances = instances
        return this.instances
    }
    
    set packages(packages) {
        this._packages = packages
        return this.packages
    }
}


export default ModulesManager