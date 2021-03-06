import Package from '../package.json'
import Connector from '../connector'
import Tracing from '../utils/Tracing'
import StackTrace from '../utils/StackTrace'
import Result from '../utils/Result'
import Manager from './Manager'
import Utils from '../utils/Utils'
import SmartobjectController from '../controllers/Smartobject'
import Core from '..'

class Smartobject extends Manager {

    public instances: Map<Number,any>
    public packages: Array<string>
    private core: Core
    private sqlSmartobject: Connector
    private smartobjectController: SmartobjectController

    constructor(core) {
        super()
        Tracing.verbose(Package.name, "Start smartobject manager")
        this.core = core
        this.packages = []
        this.instances = new Map()
        this.sqlSmartobject = new Connector("smartobject")
    }


    async before() {
        try {
            let result = await this.sqlSmartobject.updateAll({ status: 2 }, {})
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
            this.packages = []
            this.instances = new Map()
            return await this.before()
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when restart smartobject manager")
            return new Result(Package.name, true, "Error occurred when restart smartobject manager")
        }
    }

    async instanciate(smartobject) {
        try {
            if (this.instances.has(smartobject.id) === false) {
                if (this.packages.includes(smartobject.module)) {
                    try {
                        let settings = {}
                        smartobject.arguments.forEach(argument => {
                            settings[argument.reference] = argument.value
                        })

                        let configurations = null
                        let Module = null
                        Utils.clearCacheModule(smartobject["module"])
                        Tracing.verbose(Package.name, "Use essential " + smartobject["module"])
                        configurations = require("../essentials/" + smartobject["module"] + "/package.json")
                        Module = require("../essentials/" + smartobject["module"]).default


                        let instance = new Module(this.core, smartobject.id, smartobject.reference, settings, Tracing, configurations)
                        let resultUpdateRequest = await this.sqlSmartobject.updateAll({ status: 1 }, { id: smartobject.id })
                        if (resultUpdateRequest.error) {
                            return resultUpdateRequest
                        }
                        this.instances.set(smartobject.id, instance)
                        Tracing.verbose(Package.name, "Instanciate smartobject n??" + smartobject.id)
                    } catch (error) {
                        StackTrace.save(error)
                        Tracing.error(Package.name, error)
                    }
                } else {
                    this.packages.push(smartobject.module)
                    let resultInstanciate = await this.instanciate(smartobject)
                    if (resultInstanciate.error) {
                        return resultInstanciate
                    }
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when instanciate an smartobject")
            return new Result(Package.name, true, "Error occurred when instanciate an smartobject")
        }
    }

    async update(idSmartobject) {
        Tracing.verbose(Package.name, "Update smartobject instance n??" + idSmartobject)
        try {
            let getRequest = await this.smartobjectController.getOne(idSmartobject)
            if (getRequest.error) {
                return getRequest
            }
            let smartobject = getRequest.data
            if (this.instances.has(smartobject.id)) {
                this.instances.delete(smartobject.id)
            }
            let resultInstanciate = await this.instanciate(smartobject)
            if (resultInstanciate.error) {
                return resultInstanciate
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            Tracing.error(Package.name, "An error occurred when update smartobject instance n??" + idSmartobject)
            StackTrace.save(error)
            return new Result(Package.name, true, "Error occurred when update smartobject")
        }
    }

    getAll() {
        try {
            let smartobjects = []
            for (let indexPackages = 0; indexPackages < this.packages.length; indexPackages++) {
                let pPackage = this.packages[indexPackages]
                let configuration = require("../essentials/" + pPackage + "/package.json")
                smartobjects.push(configuration)
            }
            return new Result(Package.name, false, "", smartobjects)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all configuration in smartobject manager")
            return new Result(Package.name, true, "Error occurred when get all configuration in smartobject manage")
        }
    }


}

export default Smartobject