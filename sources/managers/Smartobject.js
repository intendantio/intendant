import Package from '../package'
import Connector from '../connector'
import Tracing from '../utils/Tracing'
import StackTrace from '../utils/StackTrace'
import fs from 'fs'
import Result from '../utils/Result'

class SmartobjectManager {

    constructor(core) {
        Tracing.verbose(Package.name, "Start smartobject manager")

        this.core = core

        /* Private */
        this._packages = []
        this._instances = new Map()

        /* Connector */
        this.sqlSmartobject = new Connector("smartobject")
        this.sqlSmartobjectArgument = new Connector("smartobject_argument")


    }


    async before() {
        try {
            let result = await this.sqlSmartobject.updateAll({ status: 2 })
            if (result.error) {
                Tracing.warning(Package.name, result.package + " " + result.message)
                return result
            }
            let resultInitialisation = await this.initialisation()
            if (resultInitialisation.error) {
                return resultInitialisation
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when executing before function")
            return new Result(Package.name, true, "Error occurred when executing before function")
        }
    }

    async initialisation() {
        try {
            let smartobjectsRequest = await this.smartobjectController.getAll()
            if (smartobjectsRequest.error) {
                return smartobjectsRequest
            }
            for (let smartobjectIndex = 0; smartobjectIndex < smartobjectsRequest.data.length; smartobjectIndex++) {
                let smartobject = smartobjectsRequest.data[smartobjectIndex];
                let resultInstanciate = await this.instanciate(smartobject)
                if (resultInstanciate.error) {
                    return resultInstanciate
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when initialisation smartobject manager")
            return new Result(Package.name, true, "Error occurred when initialisation smartobject manager")
        }
    }

    async restart() {
        try {
            this._instances = new Map()
            return await this.before()
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when restart smartobject manager")
            return new Result(Package.name, true, "Error occurred when restart smartobject manager")
        }
    }

    async instanciate(smartobject) {
        let instances = this._instances
        try {
            if (instances.has(smartobject.id) === false) {
                

                if (this._packages.includes(smartobject.module)) {
                    try {
                        let settings = {}
                        smartobject.arguments.forEach(argument => {
                            settings[argument.reference] = argument.value
                        })
                        let configurations = require(smartobject["module"] + "/package.json")
                        let Module = require(smartobject["module"])
                        let instance = new Module(this.core, smartobject.id, smartobject.reference, settings, Tracing,configurations)
                        let resultUpdateRequest = await this.sqlSmartobject.updateAll({ status: 1 }, { id: smartobject.id })
                        if (resultUpdateRequest.error) {
                            return resultUpdateRequest
                        }
                        instances.set(smartobject.id, instance)
                        Tracing.verbose(Package.name, "Instanciate smartobject n°" + smartobject.id)
                    } catch (error) {
                        Tracing.warning(Package.name, error)
                    }
                } else {
                    if (fs.existsSync("./node_modules/" + smartobject.module)) {
                        this._packages.push(smartobject.module)
                        let resultInstanciate = await this.instanciate(smartobject)
                        if (resultInstanciate.error) {
                            return resultInstanciate
                        }
                    } else {
                        let resultUpdateAll = await this.sqlSmartobject.updateAll({ status: 3 }, { id: smartobject.id })
                        if (resultUpdateAll.error) {
                            return resultUpdateAll
                        }
                        Tracing.warning(Package.name, "Missing package : " + smartobject.module)
                    }
                }
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when instanciate an smartobject")
            return new Result(Package.name, true, "Error occurred when instanciate an smartobject")
        }
        this._instances = instances
        return new Result(Package.name, false, "")
    }

    async update(id) {
        Tracing.verbose(Package.name, "Update smartobject instance n°" + id)
        try {
            let getRequest = await this.smartobjectController.getOne(id)
            if (getRequest.error) {
                return getRequest
            }
            let smartobject = getRequest.data
            if (this._instances.has(smartobject.id)) {
                this._instances.delete(smartobject.id)
            }
            let resultInstanciate = await this.instanciate(smartobject)
            if (resultInstanciate.error) {
                return resultInstanciate
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            Tracing.error(Package.name, "An error occurred when update smartobject instance n°" + id)
            StackTrace.save(error)
            return new Result(Package.name, true, "Error occurred when update smartobject")
        }
    }

    getAll() {
        try {
            let smartobjects = []
            for (let indexPackages = 0; indexPackages < this._packages.length; indexPackages++) {
                let pPackage = this._packages[indexPackages]
                let configuration = require(pPackage + "/package.json")
                smartobjects.push(configuration)
            }
            return new Result(Package.name, false, "", smartobjects)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all configuration in smartobject manager")
            return new Result(Package.name, true, "Error occurred when get all configuration in smartobject manage")
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


export default SmartobjectManager