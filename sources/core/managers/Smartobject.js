import Package from '../package'

class Manager {

    constructor(core) {
        this.core = core
        this.connector = core.connector
        this.logger = core.logger
        this.configuration = core.configuration
        this.installSmartobjects = []
        this.logger.verbose(Package.name, "Smartobject manager : start")
        this.smartobjects = new Map()
        this.before()
    }

    async before() {
        try {
            this.logger.verbose(Package.name, "Smartobject manager : disable smartobjects")
            let sqlSmartobject = new this.connector(this.configuration, this.core, "smartobject")
            let result = await sqlSmartobject.updateAll({ status: 2 })
            if (result.error) {
                this.logger.warning(Package.name, result.package + " " + result.message)
                return
            }
            await this.initialisation()
        } catch (error) {
            this.core.logger.error("Smartobject manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async initialisation() {
        try {
            let sqlSmartobject = new this.connector(this.configuration, this.core, "smartobject")
            let smartobjectsRequest = await sqlSmartobject.getAll()
            if (smartobjectsRequest.error) {
                this.logger.error(Package.name, smartobjectsRequest.package + " : " + smartobjectsRequest.message)
                return
            }
            smartobjectsRequest.data.forEach(async smartobject => {
                await this.instanciate(smartobject)
            })
        } catch (error) {
            this.core.logger.error("Smartobject manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async restart() {
        try {
            this.core.logger.verbose(Package.name, "Smartobject manager : restart")
            this.smartobjects = new Map()
            await this.before()
        } catch (error) {
            this.core.logger.error("Smartobject manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async instanciate(smartobject) {
        try {
            let sqlSmartobject = new this.connector(this.configuration, this.core, "smartobject")
            let sqlSmartobjectArgument = new this.connector(this.configuration, this.core, "smartobject_argument")
            if (this.smartobjects.has(smartobject.reference) === false) {
                let settingsRequest = await sqlSmartobjectArgument.getAllByField({ smartobject: smartobject.id })
                if (settingsRequest.error) {
                    this.logger.warning(Package.name, settingsRequest.package + " : " + settingsRequest.message)
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
                        let moduleConfiguration = require(smartobject["module"] + "/Package.json")
                        let instanceSmartObject = new Module(pSettings, this.core, moduleConfiguration)
                        let resultUpdateRequest = await sqlSmartobject.updateAll({ status: 1 }, { id: smartobject.id })
                        if (resultUpdateRequest.error) {
                            this.logger.warning(Package.name, resultUpdateRequest.message)
                            return
                        }
                        this.smartobjects.set(smartobject.reference, instanceSmartObject)
                        this.logger.verbose(Package.name, "Smartobject manager : instanciate smartobject n°" + smartobject.id + " successful")
                    } catch (error) {
                        this.logger.warning(Package.name, error)
                    }
                } else {
                    await sqlSmartobject.updateAll({ status: 3 }, { id: smartobject.id })
                    this.logger.warning(Package.name, "Smartobject manager : missing smartobject library " + smartobject.module)
                }
            }
        } catch (error) {
            this.core.logger.error("Smartobject manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async update(id) {
        try {
            this.core.logger.verbose(Package.name, "Smartobject manager : update smartobject n°" + id)
            let sqlSmartobject = new this.connector(this.configuration, this.core, "smartobject")
            let getRequest = await sqlSmartobject.getOne(id)
            if (getRequest.error) {
                return getRequest
            }
            let smartobject = getRequest.data
            if (this.smartobjects.has(smartobject.reference)) {
                this.smartobjects.delete(smartobject.reference)
            }
            await this.instanciate(smartobject)
            return {
                error: false,
                message: "",
                package: Package.name
            }
        } catch (error) {
            this.core.logger.error("Smartobject manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    getAll() {
        try {
            this.core.logger.verbose(Package.name, "Smartobject manager : get all smartobject configuration")
            let smartobjects = []
            this.installSmartobjects.forEach(smartobject => {
                try {
                    let configuration = require(smartobject + "/package.json")
                    smartobjects.push(configuration)
                } catch (error) {
                    this.core.logger.warning(Package.name, "Smartobject manager : inaccessible configuration from module " + smartobject)
                    this.core.logger.warning(Package.name, JSON.stringify(error.toString()))
                }
            })
            return {
                error: false,
                package: Package.name,
                message: '',
                data: smartobjects
            }
        } catch (error) {
            this.core.logger.error("Smartobject manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }
}


export default Manager