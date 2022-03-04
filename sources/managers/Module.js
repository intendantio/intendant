import Package from '../package'
import Tracing from '../utils/Tracing'
import StackTrace from '../utils/StackTrace'
import Result from '../utils/Result'
import fetch from 'node-fetch'
import fs from 'fs'
import Manager from './Manager'

class Module extends Manager {

    constructor(core) {
        super()
        this.core = core

        /* Private */
        this.packages = []
        this.instances = new Map()

        this.before()
    }

    async before() {
        try {
            Tracing.verbose(Package.name, "Start module manager")
            let resultMarket = await fetch("https://market.intendant.io/modules")
            let resultMarketJSON = await resultMarket.json()
            resultMarketJSON.filter(pModule => {
                return fs.existsSync("./node_modules/" + pModule.name)
            }).forEach(pModule => {
                this.packages.push(pModule.name)
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
            this.instances = new Map()
            for (let indexPackage = 0; indexPackage < this.packages.length; indexPackage++) {
                try {
                    let pPackage = this.packages[indexPackage]
                    let Module = require(pPackage)
                    let instanceModule = new Module(this.core, Tracing)
                    this.instances.set(pPackage, instanceModule)
                    Tracing.verbose(Package.name, "Instanciate " + pPackage)
                } catch (error) {
                    StackTrace.save(error)
                    Tracing.error(Package.name, "Error occurred when instanciate " + pPackage)
                    this.packages = this.packages.filter(installModule => {
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
    getAll() {
        try {
            let modules = []
            for (let indexPackage = 0; indexPackage < this.packages.length; indexPackage++) {
                let pPackage = this.packages[indexPackage]
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

}


export default Module