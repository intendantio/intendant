import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from '../utils/StackTrace'
import _ from 'lodash'
import md5 from 'md5'
import fetch from 'node-fetch'
import fsExtra from 'fs-extra'
import { exec } from 'child_process'
import Utils from '../utils/Utils'

class Module extends Controller {

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

    getOne(pPackage) {
        try {
            let configuration = require(pPackage + "/package.json")
            return new Result(Package.name, false, "", configuration)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all configuration in module")
            return new Result(Package.name, true, "Error occurred when get all configuration in module")
        }
    }

    getAll() {
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

    getBySum(sum) {
        let data = false
        this.moduleManager.packages.forEach(pModule => {
            if (Utils.getSum(pModule) == sum) {
                data = pModule
            }
        })
        return new Result(Package.name, false, "", data) 
      }

    


    async install(pPackage) {
        try {
            Tracing.verbose(Package.name, "Download list from https://market.intendant.io/modules.json")
            let resultMarket = await fetch("https://market.intendant.io/modules.json", {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            })
            let resultMarketJSON = await resultMarket.json()
            resultMarketJSON = resultMarketJSON.filter(item => {
                return md5(item.name) == pPackage
            })
            if (resultMarketJSON.length == 0) {
                Tracing.warning(Package.name, "Package not found " + pPackage)
                return new Result(Package.name, true, "Package not found " + pPackage)
            } else if (resultMarketJSON.length > 1) {
                Tracing.warning(Package.name, "Package not found " + pPackage)
                return new Result(Package.name, true, "Package not found " + pPackage)
            } else {
                let item = resultMarketJSON[0]

                let resultRaw = await fetch(item.raw, {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                })
                let resultRawJson = await resultRaw.json()
                if (Utils.isCompatible(Package.version, resultRawJson.core)) {
                    Tracing.verbose(Package.name, "Install " + item.name)
                    await new Promise((resolve, reject) => {
                        exec("npm install " + resultRawJson.url + " --silent 2>&1 | tee t", (e, std, ster) => {
                            resolve()
                        })
                    })
                    this.moduleManager.packages.push(item.name)
                    this.moduleManager.restart()
                    return new Result(Package.name, false, "")
                } else {
                    Tracing.warning(Package.name, "Core must have a minimum version of " + resultRawJson.core + " to accept the module")
                    return new Result(Package.name, true, "Core must have a minimum version of " + resultRawJson.core + " to accept the module")
                }
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when install new package")
            return new Result(Package.name, true, "Error occurred install new package")
        }
    }

    async uninstall(pPackage) {
        try {
            Tracing.verbose(Package.name, "Uninstall " + pPackage)

            await new Promise((resolve, reject) => {
                exec("npm uninstall " + pPackage + " --silent 2>&1 | tee t", (e, std, ster) => {
                    resolve()
                })
            })

            if (fs.existsSync("./node_modules/" + pPackage)) {
                fsExtra.rmSync("./node_modules/" + pPackage, { recursive: true, force: true })
            }
            this.moduleManager.packages = this.moduleManager.packages.filter((pModule) => {
                return pPackage != pModule
            })
            this.smartobjectManager.packages = this.smartobjectManager.packages.filter((pSmartobject) => {
                return pPackage != pSmartobject
            })
            this.moduleManager.restart()
            await this.smartobjectManager.restart()

            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when uninstall a package")
            return new Result(Package.name, true, "Error occurred when uninstall a package")
        }
    }

}

export default Module