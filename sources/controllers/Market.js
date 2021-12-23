import Controller from "./Controller"
import fetch from 'node-fetch'
import fs from 'fs'
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import { exec } from 'child_process'
import StackTrace from "../utils/StackTrace"

class Market extends Controller {

    constructor(smartobjectManager,moduleManager) {
        super()
        this.moduleManager = moduleManager
        this.smartobjectManager = smartobjectManager
    }

    async install(pPackage) {
        try {
            Tracing.verbose(Package.name, "Download list from https://market.intendant.io")
            let resultMarket = await fetch("https://market.intendant.io", {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            })
            let resultMarketJSON = await resultMarket.json()
            resultMarketJSON = resultMarketJSON.filter(item => {
                return item.name == pPackage
            })
            if (resultMarketJSON.length == 0) {
                Tracing.warning(Package.name, "Package not found " + pPackage)
                return new Result(Package.name,true,"Package not found " + pPackage)
            } else if (resultMarketJSON.length > 1) {
                Tracing.warning(Package.name, "Package not found " + pPackage)
                return new Result(Package.name,true,"Package not found " + pPackage)
            } else {
                let item = resultMarketJSON[0]
                Tracing.verbose(Package.name, "Install " + item.name)
                await new Promise((resolve, reject) => {
                    exec("npm install " + item.raw + " --silent 2>&1 | tee t", (e, std, ster) => {
                        resolve()
                    })
                })
                if (pPackage.includes("smartobject")) {
                    this.smartobjectManager.packages.push(pPackage)
                    await this.smartobjectManager.restart()
                } else if (pPackage.includes("module")) {
                    this.moduleManager.packages.push(pPackage)
                    this.moduleManager.restart()
                }
                return new Result(Package.name,false,"")
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
            
            if(fs.existsSync("./node_modules/" + pPackage)) {
                fs.rmSync("./node_modules/" + pPackage,{recursive:true,force: true})
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

export default Market