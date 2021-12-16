import Package from '../package'
import fs from 'fs'
import Connector from '../connector'
import Tracing from '../utils/Tracing'

class Manager {

    constructor(core) {
        this.core = core
        this.configuration = core.configuration
        this.installSmartobjects = []
        Tracing.verbose(Package.name, "Smartobject manager : start")
        this.smartobjects = new Map()
        this.before()
    }

    async before() {
        try {
            Tracing.verbose(Package.name, "Smartobject manager : disable smartobjects")
            let sqlSmartobject = new Connector("smartobject")
            let result = await sqlSmartobject.updateAll({ status: 2 })
            if (result.error) {
                Tracing.warning(Package.name, result.package + " " + result.message)
                return
            }
            await this.initialisation()
        } catch (error) {
            Tracing.error("Smartobject manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async initialisation() {
        try {
            let sqlSmartobject = new Connector("smartobject")
            let smartobjectsRequest = await sqlSmartobject.getAll()
            if (smartobjectsRequest.error) {
                Tracing.error(Package.name, smartobjectsRequest.package + " : " + smartobjectsRequest.message)
                return
            }
            smartobjectsRequest.data.forEach(async smartobject => {
                await this.instanciate(smartobject)
            })
        } catch (error) {
            Tracing.error("Smartobject manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async restart() {
        try {
            Tracing.verbose(Package.name, "Smartobject manager : restart")
            this.smartobjects = new Map()
            await this.before()
        } catch (error) {
            Tracing.error("Smartobject manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async instanciate(smartobject) {
        try {
            let sqlSmartobject = new Connector("smartobject")
            let sqlSmartobjectArgument = new Connector("smartobject_argument")
            if (this.smartobjects.has(smartobject.id) === false) {
                let settingsRequest = await sqlSmartobjectArgument.getAllByField({ smartobject: smartobject.id })
                if (settingsRequest.error) {
                    Tracing.warning(Package.name, settingsRequest.package + " : " + settingsRequest.message)
                    return
                }
                let settings = settingsRequest.data
                let pSettings = {
                    _id: smartobject.id.toString()
                }
                for (let index = 0; index < settings.length; index++) {
                    let setting = settings[index]
                    pSettings[setting.reference] = setting.value
                }
                if (this.installSmartobjects.includes(smartobject.module)) {
                    try {
                        let Module = require(smartobject["module"])
                        let instanceSmartObject = new Module(this.core, pSettings, Tracing)
                        let resultUpdateRequest = await sqlSmartobject.updateAll({ status: 1 }, { id: smartobject.id })
                        if (resultUpdateRequest.error) {
                            Tracing.warning(Package.name, resultUpdateRequest.message)
                            return
                        }
                        this.smartobjects.set(smartobject.id, instanceSmartObject)
                        Tracing.verbose(Package.name, "Smartobject manager : instanciate smartobject n°" + smartobject.id + " successful")
                    } catch (error) {
                        Tracing.warning(Package.name, error)
                    }
                } else {
                    if(fs.existsSync("./node_modules/" + smartobject.module)) {
                        this.installSmartobjects.push(smartobject.module)
                        this.instanciate(smartobject)
                    } else {
                        await sqlSmartobject.updateAll({ status: 3 }, { id: smartobject.id })
                        Tracing.warning(Package.name, "Smartobject manager : missing smartobject library " + smartobject.module)
                    }
                }
            }
        } catch (error) {
            Tracing.error("Smartobject manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async update(id) {
        try {
            Tracing.verbose(Package.name, "Smartobject manager : update smartobject n°" + id)
            let sqlSmartobject = new this.connector("smartobject")
            let getRequest = await sqlSmartobject.getOne(id)
            if (getRequest.error) {
                return getRequest
            }
            let smartobject = getRequest.data
            if (this.smartobjects.has(smartobject.id)) {
                this.smartobjects.delete(smartobject.id)
            }
            await this.instanciate(smartobject)
            return {
                error: false,
                message: "",
                package: Package.name
            }
        } catch (error) {
            Tracing.error("Smartobject manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    getAll() {
        try {
            Tracing.verbose(Package.name, "Smartobject manager : get all smartobject configuration")
            let smartobjects = []
            this.installSmartobjects.forEach(smartobject => {
                try {
                    let configuration = require(smartobject + "/package.json")
                    smartobjects.push(configuration)
                } catch (error) {
                    Tracing.warning(Package.name, "Smartobject manager : inaccessible configuration from module " + smartobject)
                    Tracing.warning(Package.name, JSON.stringify(error.toString()))
                }
            })
            return {
                error: false,
                package: Package.name,
                message: '',
                data: smartobjects
            }
        } catch (error) {
            Tracing.error("Smartobject manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }
}


export default Manager