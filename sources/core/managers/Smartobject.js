import Package from '../package'

class Manager {

    constructor(core) {
        this.core = core
        this.connector = core.connector
        this.logger = core.logger
        this.configuration = core.configuration
        this.logger.verbose(Package.name, "Start Manager")
        this.smartobjects = new Map()
        this.before()
    }

    async before() {

        let sqlSmartobject = new this.connector(this.configuration, this.core, "smartobject")
        let result = await sqlSmartobject.updateAll({ status: 2 })
        if (result.error) {
            this.logger.warning(Package.name, result.code + " " + result.message)
            return
        }
        await this.initialisation()
    }

    async initialisation() {
        let sqlSmartobject = new this.connector(this.configuration, this.core, "smartobject")
        let smartobjectsRequest = await sqlSmartobject.getAll()
        if (smartobjectsRequest.error) {
            this.logger.error(Package.name, smartobjectsRequest.code + " : " + smartobjectsRequest.message)
            return
        }
        smartobjectsRequest.data.forEach(async smartobject => {
            await this.instanciate(smartobject)
        })
    }

    async restart() {
        this.core.logger.verbose(Package.name, "Restart Smartobject Manager")
        await this.initialisation()
    }

    async instanciate(smartobject) {
        let sqlSmartobject = new this.connector(this.configuration, this.core, "smartobject")
        let sqlSmartobjectArgument = new this.connector(this.configuration, this.core, "smartobject_argument")
        if (this.smartobjects.has(smartobject.reference) === false) {
            let settingsRequest = await sqlSmartobjectArgument.getAllByField({ smartobject: smartobject.id })
            if (settingsRequest.error) {
                this.logger.warning(Package.name, settingsRequest.code + " : " + settingsRequest.message)
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

            if (this.configuration.smartobjects.includes(smartobject.module)) {
                try {
                    let Module = require(require('path').resolve('./') + "/.intendant/" + smartobject["module"] + "/index.js")
                    let moduleConfiguration = require(require('path').resolve('./') + "/.intendant/" + smartobject["module"] + "/configuration.json")
                    let instanceSmartObject = new Module(pSettings, this.core, moduleConfiguration)
                    let resultUpdateRequest = await sqlSmartobject.updateAll({ status: 1 }, { id: smartobject.id })
                    if (resultUpdateRequest.error) {
                        this.logger.warning(Package.name, resultUpdateRequest.message)
                        return
                    }
                    this.smartobjects.set(smartobject.reference, instanceSmartObject)
                } catch (error) {
                    this.logger.warning(Package.name, error)
                }
            } else {
                await sqlSmartobject.updateAll({ status: 3 }, { id: smartobject.id })
                this.logger.warning(Package.name, "Package " + smartobject.module + " has not installed")
            }
        }
    }

    async update(id) {
        this.core.logger.verbose(Package.name, "Update smartobject " + id)
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
            code: "ok"
        }
    }

    getAll() {
        this.core.logger.verbose(Package.name, "Get all smartobject")
        let smartobjects = []
        this.configuration.smartobjects.forEach(smartobject => {
            try {
                let configuration = require(require('path').resolve('./') + "/.intendant/" +  smartobject + "/configuration.json")
                smartobjects.push(configuration)
            } catch (error) {
                this.core.logger.warning(Package.name, "Impossible get configuration in " + smartobject + " module")
                this.core.logger.warning(Package.name, JSON.stringify(error.toString()))
            }
        })
        return {
            error: false,
            code: 'ok',
            message: '',
            data: smartobjects
        }
    }
}


export default Manager