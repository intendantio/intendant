import Controller from "./Controller"
import fetch from 'node-fetch'
import extract from 'extract-zip'
import fs from 'fs'
import npm from 'npm'
import Package from '../package.json'

import { exec } from 'child_process'

class Market extends Controller {

    async install(pPackage) {

        let resultMarket = await fetch("https://market.intendant.io")
        let resultMarketJSON = await resultMarket.json()

        resultMarketJSON = resultMarketJSON.filter(item => {
            return item.name == pPackage
        })

        if(resultMarketJSON.length == 0) {
            this.core.logger.warning(Package.name,"Package not found")
            return {
                package: Package.name,
                message: "",
                error: true
            }
        } else if(resultMarketJSON.length > 1) {
            this.core.logger.warning(Package.name,"Package not found")
            return {
                package: Package.name,
                message: "",
                error: true
            }
        } else {

            this.core.logger.verbose(Package.name,"Find package " + pPackage)
            let item = resultMarketJSON[0]

            this.core.logger.verbose(Package.name,"Start download package " + pPackage)


            
            await new Promise((resolve, reject) => {
                exec("npm install " +  item.raw + " --silent 2>&1 | tee t",(e,std,ster) => {
                    resolve()
                })
            })
            
            this.core.logger.verbose(Package.name,"Restart configuration")
            if(pPackage.includes("smartobject")) {
                this.core.manager.smartobject.installSmartobjects.push(pPackage)
                await this.core.manager.smartobject.restart()
            } else if(pPackage.includes("module")) {
                this.core.manager.module.installModules.push(pPackage)
                this.core.manager.module.restart()
            }
            return {
                package: Package.name,
                message: "",
                error: false
            }
        }
    }

    async uninstall(pPackage) {

        this.core.logger.verbose(Package.name,"Delete Package " + pPackage)

        this.core.logger.verbose(Package.name,"Restart configuration")
            
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
    }
}

export default Market