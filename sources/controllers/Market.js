import Controller from "./Controller"
import fetch from 'node-fetch'
import extract from 'extract-zip'
import fs from 'fs'
import npm from 'npm'
import Package from '../package.json'
import Tracing from "../utils/Tracing"

import { exec } from 'child_process'

class Market extends Controller {

    async install(pPackage) {
        try {
            Tracing.verbose(Package.name, "Market controller : download file from https://market.intendant.io")
            let resultMarket = await fetch("https://market.intendant.io")
            let resultMarketJSON = await resultMarket.json()
            resultMarketJSON = resultMarketJSON.filter(item => {
                return item.name == pPackage
            })
            if (resultMarketJSON.length == 0) {
                Tracing.warning(Package.name, "Market controller : package not found " + pPackage)
                return {
                    package: Package.name,
                    message: "",
                    error: true
                }
            } else if (resultMarketJSON.length > 1) {
                Tracing.warning(Package.name, "Market controller : package not found " + pPackage)
                return {
                    package: Package.name,
                    message: "",
                    error: true
                }
            } else {


                let item = resultMarketJSON[0]
                

                Tracing.verbose(Package.name, "Market controller : install package " + item.raw)
                await new Promise((resolve, reject) => {
                    exec("npm install " + item.raw + " --silent 2>&1 | tee t", (e, std, ster) => {
                        resolve()
                    })
                })
                Tracing.verbose(Package.name, "Market controller : install " + pPackage + " successful")
                if (pPackage.includes("smartobject")) {
                    Tracing.verbose(Package.name, "Market controller : restart smartobject manager")
                    this.core.manager.smartobject.installSmartobjects.push(pPackage)
                    await this.core.manager.smartobject.restart()
                } else if (pPackage.includes("module")) {
                    Tracing.verbose(Package.name, "Market controller : restart module manager")
                    this.core.manager.module.installModules.push(pPackage)
                    this.core.manager.module.restart()
                }
                return {
                    package: Package.name,
                    message: "",
                    error: false
                }
            }
        } catch (error) {
            Tracing.error("Market : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async uninstall(pPackage) {
        try {
            Tracing.verbose(Package.name, "Market controller : delete Package " + pPackage)
            Tracing.verbose(Package.name, "Market controller : restart configuration")
            
            await new Promise((resolve, reject) => {
                exec("npm uninstall " + pPackage + " --silent 2>&1 | tee t", (e, std, ster) => {
                    resolve()
                })
            })
            
            if(fs.existsSync("./node_modules/" + pPackage)) {
                fs.rmSync("./node_modules/" + pPackage,{recursive:true,force: true})
            }
            this.core.manager.module.installModules = this.core.manager.module.installModules.filter((pModule) => {
                return pPackage != pModule
            })
            this.core.manager.smartobject.installSmartobjects = this.core.manager.smartobject.installSmartobjects.filter((pSmartobject) => {
                return pPackage != pSmartobject
            })
            this.core.manager.module.restart()
            await this.core.manager.smartobject.restart()
            return {
                package: Package.name,
                message: "",
                error: false
            }
        } catch (error) {
            Tracing.error("Market : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }
}

export default Market