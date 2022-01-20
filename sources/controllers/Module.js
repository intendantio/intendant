import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from '../utils/StackTrace'
import _ from 'lodash'
import md5 from 'md5'

class Module extends Controller {

    constructor(moduleManager) {
        super()
        this.moduleManager = moduleManager
    }

    async getState(pModule) {
        try {
            return await this.executeAction(pModule, "state", {})
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get state in module")
            return new Result(Package.name, true, "Error occurred when get state in module")
        }
    }

    async executeAction(pModule, action, settings) {
        try {
            if (this.moduleManager.instances.has(pModule)) {
                let instanceModule = this.moduleManager.instances.get(pModule)
                if (typeof instanceModule["__" + action] === "function") {
                    return await instanceModule["__" + action](settings)
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


    getAllConfiguration() {
        try {
            let modules = []
            for (let indexPackage = 0; indexPackage < this.moduleManager.packages.length; indexPackage++) {
                let pPackage = this.moduleManager.packages[indexPackage]
                let configuration = require(pPackage + "/package.json")
                modules.push(configuration)
            }
            return new Result(Package.name, false, "", modules)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all configuration in module")
            return new Result(Package.name, true, "Error occurred when get all configuration in module")
        }
    }

    getByHash(hash) {
        let data = false
        this.moduleManager.packages.forEach(pModule => {
            if (md5(pModule) == hash) {
                data = pModule
            }
        })
        return new Result(Package.name, false, "", data)
    }

}

export default Module