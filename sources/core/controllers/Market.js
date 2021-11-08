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

            let result = await fetch(item.raw)
            const buffer = await result.buffer();
            fs.mkdirSync(require('path').resolve('./') + "/.intendant/" + pPackage,{recursive: true})
            fs.writeFileSync(require('path').resolve('./') + "/.tmp-download.zip",buffer)
            this.core.logger.verbose(Package.name,"Extract package " + pPackage)
            await extract(require('path').resolve('./') + "/.tmp-download.zip", { dir: require('path').resolve('./') + "/.intendant/" + pPackage })
            this.core.logger.verbose(Package.name,"Remove tmp file")
            fs.unlinkSync(require('path').resolve('./') + "/.tmp-download.zip")
            
            let tmpPackage = JSON.parse(fs.readFileSync(require('path').resolve('./') + "/package.json").toString())

            let currentPackage = JSON.parse(fs.readFileSync(require('path').resolve('./') + "/.intendant/" + pPackage + "/package.json").toString())

            for (let key in currentPackage.dependencies) {
                    let dependencie = currentPackage.dependencies[key]
                    let findInCurrent = false
                    for (let tmpKey in tmpPackage.dependencies) {
                        let tmpDependencie = tmpPackage.dependencies[tmpKey]
                        if(key == tmpKey) {
                            findInCurrent = tmpDependencie
                        }
                    }
                    if(findInCurrent) {} else {
                        this.core.logger.verbose(Package.name,"Add dependencie " + key + ":" + dependencie)
                        tmpPackage.dependencies[key] = dependencie
                    }
                }
            fs.writeFileSync(require('path').resolve('./') + "/package.json",JSON.stringify(tmpPackage), null, 4)
            await new Promise((resolve, reject) => {
                npm.load(() => {
                    resolve()
                })
            })
            await new Promise((resolve, reject) => {
                npm.commands.install([],() => {
                    resolve()
                })
            })
            this.core.logger.verbose(Package.name,"Restart configuration")
            this.core.prepare()
            this.core.manager.module.restart()
            await this.core.manager.smartobject.restart()
            return {
                package: Package.name,
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
            package: Package.name,
            message: "",
            error: false
        }
    }
}

export default Market