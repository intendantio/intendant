import Package from '../package'
import Controller from './Controller'
import Tracing from "../utils/Tracing"

class Smartobject extends Controller {

    constructor(smartobjectManager) {
        super()
        this.smartobjectManager = smartobjectManager
    }

    async getAll() {
        try {
            let pSmartObjects = []
            let smartobjectsRequest = await this.sqlSmartobject.getAll()
            if (smartobjectsRequest.error) {
                return smartobjectsRequest
            } else {
                let smartobjects = smartobjectsRequest.data
                for (let indexSmartObject = 0; indexSmartObject < smartobjects.length; indexSmartObject++) {
                    let smartobject = smartobjects[indexSmartObject]
                    let resultSmartobject = await this.getOne(smartobject.id)
                    if (resultSmartobject.error) {
                        return resultSmartobject
                    } else {
                        pSmartObjects.push(resultSmartobject.data)
                    }
                }
            }
            return {
                error: false,
                package: Package.name,
                message: '',
                data: pSmartObjects
            }
        } catch (error) {
            Tracing.error(Package.name,"SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async deleteArguments(idArgument) {
        try {
            Tracing.verbose(Package.name, "Delete smartobject_argument to [" + idArgument + "]")
            let getRequest = await this.sqlSmartobjectArgument.getOne(idArgument)
            if (getRequest.error) {
                return getRequest
            }
            let smartobjectArgument = getRequest.data
            let deleteAllRequest = await this.sqlSmartobjectArgument.deleteAllByField({
                id: idArgument
            })
            if (deleteAllRequest.error) {
                return deleteAllRequest
            }
            let updateRequest = await this.smartobjectManager.update(smartobjectArgument.smartobject)
            if (updateRequest.error) {
                return updateRequest
            }
            return {
                error: false,
                message: "",
                package: Package.name
            }
        } catch (error) {
            Tracing.error(Package.name,"SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async insertArguments(idSmartobject, reference, value) {
        try {
            Tracing.verbose(Package.name, "Insert smartobject_argument to " + idSmartobject + " [" + reference + ":" + value + "]")
            if (reference) {
                if (value) {
                    let smartobjectRequest = await this.sqlSmartobject.getOne(idSmartobject)
                    if (smartobjectRequest.error) {
                        return smartobjectRequest
                    }
                    let insertRequest = await this.sqlSmartobjectArgument.insert({
                        id: null,
                        smartobject: idSmartobject,
                        reference: reference,
                        value: value
                    })
                    if (insertRequest.error) {
                        return insertRequest
                    }
                    let updateRequest = await this.smartobjectManager.update(smartobjectRequest.data.id)
                    if (updateRequest.error) {
                        return updateRequest
                    }
                    return {
                        error: false,
                        message: "",
                        package: Package.name
                    }
                } else {
                    Tracing.warning(Package.name, "Missing smartobject_argument value")
                    return {
                        error: true,
                        message: "Missing smartobject_argument value",
                        package: Package.name
                    }
                }
            } else {
                Tracing.warning(Package.name, "Missing smartobject_argument reference")
                return {
                    error: true,
                    message: "Missing smartobject_argument reference",
                    package: Package.name
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async getOne(idSmartobject) {
        try {
            let smartobjectRequest = await this.sqlSmartobject.getOne(idSmartobject)
            if (smartobjectRequest.error) {
                return smartobjectRequest
            }
            if (smartobjectRequest.data === false) {
                return {
                    error: true,
                    message: "Smartobject not found",
                    package: Package.name
                }
            }
            let smartobject = smartobjectRequest.data
            let argumentsRequest = await this.sqlSmartobjectArgument.getAllByField({ smartobject: smartobject["id"] })
            if (argumentsRequest.error) {
                return argumentsRequest
            }
            let argumentsData = argumentsRequest.data
            let statusRequest = await this.sqlSmartobjectStatus.getOne(smartobject["status"])
            if (statusRequest.error) {
                return statusRequest
            }
            let status = statusRequest.data
            let smartobjectProfileRequest = await this.sqlSmartobjectProfile.getAllByField({ smartobject: smartobject["id"] })
            if (smartobjectProfileRequest.error) {
                return smartobjectProfileRequest
            }
            let profiles = smartobjectProfileRequest.data
            let actions = []
            let icon = null
            if (this.smartobjectManager.instances.has(smartobject.id)) {
                actions = this.smartobjectManager.instances.get(smartobject.id).getActions()
                icon = this.smartobjectManager.instances.get(smartobject.id).moduleConfiguration.icon
            }
            return {
                error: false,
                data: {
                    id: smartobject.id,
                    icon: icon,
                    module: smartobject.module,
                    reference: smartobject.reference,
                    lastUse: smartobject.last_use,
                    status: status,
                    arguments: argumentsData,
                    actions: actions,
                    profiles: profiles
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async insertSmartobjectProfile(idSmartobject, idProfile) {
        try {
            let smartobjectRequest = await this.sqlSmartobject.getOne(idSmartobject)
            if (smartobjectRequest.error) {
                return smartobjectRequest
            }
            let smartobject = smartobjectRequest.data
            let profileRequest = await this.sqlSmartobjectProfile.getOneByField({ smartobject: idSmartobject, profile: idProfile })
            if (profileRequest.error) {
                return profileRequest
            }
            let profile = profileRequest.data
            if (profile === false) {
                let insertProfile = await this.sqlSmartobjectProfile.insert({ id: null, smartobject: smartobject.id, profile: idProfile })
                if (insertProfile.error) {
                    return insertProfile
                }
            }
            return {
                error: false,
                message: '',
                package: Package.name
            }
        } catch (error) {
            Tracing.error(Package.name,"SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async deleteSmartobjectProfile(idSmartobject, idProfile) {
        try {
            let smartobjectRequest = await this.sqlSmartobject.getOne(idSmartobject)
            if (smartobjectRequest.error) {
                return smartobjectRequest
            }
            let smartobject = smartobjectRequest.data
            let profileRequest = await this.sqlSmartobjectProfile.getOneByField({ smartobject: idSmartobject, profile: idProfile })
            if (profileRequest.error) {
                return profileRequest
            }
            let profile = profileRequest.data
            if (profile) {
                let deleteProfileRequest = await this.sqlSmartobjectProfile.deleteAllByField({ id: profile.id })
                if (deleteProfileRequest.error) {
                    return deleteProfileRequest
                }
            }
            return {
                error: false,
                message: '',
                package: Package.name
            }
        } catch (error) {
            Tracing.error(Package.name,"SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async updateLastUse(idSmartobject) {
        try {
            let updateRequest = await this.sqlSmartobject.updateAll({ last_use: "DATE:NOW" }, { id: idSmartobject })
            if (updateRequest.error) {
                return updateRequest
            }
            return {
                error: false,
                message: "",
                package: Package.name
            }
        } catch (error) {
            Tracing.error(Package.name,"SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async insert(pModule, reference, pArguments) {
        try {
            if (pModule) {
                if (reference) {
                    if (pArguments) {
                        let smartobjectRequest = await this.sqlSmartobject.getOneByField({ reference: reference })
                        if (smartobjectRequest.error) {
                            return smartobjectRequest
                        }
                        let smartobject = smartobjectRequest.data
                        if (smartobject) {
                            Tracing.warning(Package.name, "Smartobject already exist")
                            return {
                                error: true,
                                message: "Smartobject already exist",
                                package: Package.name
                            }
                        } else {
                            let data = {
                                id: null,
                                module: pModule,
                                status: '2',
                                reference: reference,
                                last_use: "DATE:NOW"
                            }
                            let insertRequest = await this.sqlSmartobject.insert(data)
                            if (insertRequest.error) {
                                return insertRequest
                            } else {
                                let smartObjectId = insertRequest.data.insertId
                                for (let index = 0; index < pArguments.length; index++) {
                                    let setting = pArguments[index]
                                    let insertSettngsRequest = await this.sqlSmartobjectArgument.insert({
                                        id: null,
                                        smartobject: smartObjectId,
                                        reference: setting.reference,
                                        value: setting.value
                                    })
                                    if (insertSettngsRequest.error) {
                                        return insertSettngsRequest
                                    }
                                }
                                this.smartobjectManager.update(smartObjectId)
                                return {
                                    error: false,
                                    message: "",
                                    package: Package.name
                                }
                            }
                        }
                    } else {
                        Tracing.warning(Package.name, "Missing smartobject arguments")
                        return {
                            error: true,
                            message: "Missing smartobject arguments",
                            package: Package.name
                        }
                    }
                } else {
                    Tracing.warning(Package.name, "Missing smartobject reference")
                    return {
                        error: true,
                        message: "Missing smartobject reference",
                        package: Package.name
                    }
                }
            } else {
                Tracing.warning(Package.name, "Missing smartobject module")
                return {
                    error: true,
                    message: "Missing smartobject module",
                    package: Package.name
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async delete(idSmartobject) {
        try {
            let historyettingsRequest = await this.sqlSmartobjectArgument.deleteAllByField({ smartobject: idSmartobject })
            if (historyettingsRequest.error) {
                return historyettingsRequest
            }
            let smartobjectRequest = await this.sqlSmartobject.deleteOne(idSmartobject)
            if (smartobjectRequest.error) {
                return smartobjectRequest
            }
            return {
                error: false,
                message: "",
                package: Package.name
            }
        } catch (error) {
            Tracing.error(Package.name,"SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    isAllow(smartobject, profile, force = false) {
        let allow = false
        smartobject.profiles.forEach(pprofile => {
            if (pprofile.profile == profile) {
                allow = true
            }
        })
        return allow || force
    }

    async executeAction(idSmartobject, idAction, idProfile, pArguments, force = false) {
        try {
            if (idAction) {
                if (idProfile) {
                    let smartobjectRequest = await this.sqlSmartobject.getOne(idSmartobject)
                    if (smartobjectRequest.error) {
                        return smartobjectRequest
                    }
                    if (smartobjectRequest.data == false) {
                        return {
                            error: true,
                            message: "Smartobject not found",
                            package: Package.name
                        }
                    }
                    if (this.smartobjectManager.instances.has(smartobjectRequest.data.id)) {
                        let instanceSmartobject = this.smartobjectManager.instances.get(smartobjectRequest.data.id)
                        let smartobject = await this.getOne(instanceSmartobject.id)

                        if (this.isAllow(smartobject.data, idProfile, force)) {
                            return instanceSmartobject.action(idAction, pArguments)
                        } else {
                            return {
                                error: true,
                                message: "You are not allowed",
                                package: Package.name
                            }
                        }
                    } else {
                        Tracing.warning(Package.name, "Smartobject " + reference + " is missing")
                        return {
                            error: true,
                            message: "Smartobject " + reference + " is not loaded",
                            package: Package.name
                        }
                    }
                } else {
                    Tracing.warning(Package.name, "Missing smartobject arguments when executeAction")
                    return {
                        error: true,
                        message: "Missing smartobject arguments",
                        package: Package.name
                    }
                }
            } else {
                Tracing.warning(Package.name, "Missing smartobject action when executeAction")
                return {
                    error: true,
                    message: "Missing smartobject action",
                    package: Package.name
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    /* Deprecated */
    async getConfiguration() {
        try {
            Tracing.warning(Package.name, "getConfiguration() is deprecated")
            /*
            let modules = []
            this.core.configuration.smartobjects.forEach(pModule => {
                try {
                    let configuration = require(pModule + "/package.json")
                    modules.push(configuration)
                } catch (error) {
                    Tracing.warning(Package.name, "Impossible get configuration in " + pModule + " module")
                }
            })
            */
            return {
                error: false,
                package: Package.name,
                message: '',
                data: modules
            }
        } catch (error) {
            Tracing.error(Package.name,"SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }


}

export default Smartobject