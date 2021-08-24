import Controller from "./Controller"
import fetch from 'node-fetch'
import extract from 'extract-zip'
import fs from 'fs'
import npm from 'npm'
import Package from '../package.json'

class Market extends Controller {

    async install(pPackage) {

        let resultMarket = await fetch("https://market.intendant.io")
        let resultMarketJSON = await resultMarket.json()

        resultMarketJSON = resultMarketJSON.filter(item => {
            return item.package == pPackage
        })

        if(resultMarketJSON.length == 0) {
            this.core.logger.warning(Package.name,"Package not found")
            return {
                code: Package.name + ">Package>NotFound",
                message: "",
                error: true
            }
        } else if(resultMarketJSON.length > 1) {
            this.core.logger.warning(Package.name,"Package not found")
            return {
                code: Package.name + ">Package>NotFound",
                message: "",
                error: true
            }
        } else {

            this.core.logger.verbose(Package.name,"Find package " + pPackage)
            let item = resultMarketJSON[0]

            this.core.logger.verbose(Package.name,"Start download package " + pPackage)

            let result = await fetch(item.raw)
            const buffer = await result.buffer();
            fs.mkdirSync(require('path').resolve('./') + "/.intendant/" + pPackage,{recursive: true})
            fs.writeFileSync(require('path').resolve('./') + "/.tmp-download.zip",buffer)
            this.core.logger.verbose(Package.name,"Extract package " + pPackage)
            await extract(require('path').resolve('./') + "/.tmp-download.zip", { dir: require('path').resolve('./') + "/.intendant/" + pPackage })
            this.core.logger.verbose(Package.name,"Remove tmp file")
            fs.unlinkSync(require('path').resolve('./') + "/.tmp-download.zip")
            await new Promise((resolve, reject) => {
                npm.load(() => {
                    resolve()
                })
            })
            await new Promise((resolve, reject) => {
                npm.commands.install([require('path').resolve('./') + "/.intendant/" + pPackage + "/package.json","--silent"],() => {
                    resolve()
                })
            })
            this.core.logger.verbose(Package.name,"Restart configuration")
            
            this.core.prepare()

            this.core.manager.module.restart()
            await this.core.manager.smartobject.restart()

            return {
                code: 'ok',
                message: "",
                error: false
            }
        }
    }

    async uninstall(pPackage) {

        this.core.logger.verbose(Package.name,"Delete Package " + pPackage)
        fs.rmdirSync(require('path').resolve('./') + "/.intendant/" + pPackage, { recursive: true })
        this.core.logger.verbose(Package.name,"Restart configuration")
            
        this.core.prepare()

        this.core.manager.module.restart()
        await this.core.manager.smartobject.restart()

        return {
            code: 'ok',
            message: "",
            error: false
        }
    }
}

export default Market