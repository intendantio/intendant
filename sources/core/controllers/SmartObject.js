import Package from '../package'
import Controller from './Controller'

class SmartObject extends Controller {

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
            this.core.logger.error("SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async deleteArguments(idArgument) {
        try {
            this.core.logger.verbose(Package.name, "Delete smartobject_argument to [" + idArgument + "]")
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
            let updateRequest = await this.core.manager.smartobject.update(smartobjectArgument.smartobject)
            if (updateRequest.error) {
                return updateRequest
            }
            return {
                error: false,
                message: "",
                package: Package.name
            }
        } catch (error) {
            this.core.logger.error("SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async insertArguments(idSmartobject, reference, value) {
        try {
            this.core.logger.verbose(Package.name, "Insert smartobject_argument to " + idSmartobject + " [" + reference + ":" + value + "]")
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
                    let updateRequest = await this.core.manager.smartobject.update(smartobjectRequest.data.id)
                    if (updateRequest.error) {
                        return updateRequest
                    }
                    return {
                        error: false,
                        message: "",
                        package: Package.name
                    }
                } else {
                    this.core.logger.warning(Package.name, "Missing smartobject_argument value")
                    return {
                        error: true,
                        message: "Missing smartobject_argument value",
                        package: Package.name
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "Missing smartobject_argument reference")
                return {
                    error: true,
                    message: "Missing smartobject_argument reference",
                    package: Package.name
                }
            }
        } catch (error) {
            this.core.logger.error("SmartObject : " + error.toString())
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
            if (this.core.manager.smartobject.smartobjects.has(smartobject.id)) {
                actions = this.core.manager.smartobject.smartobjects.get(smartobject.id).moduleConfiguration.actions
                actions = actions.map(action => {
                    action.allow = false
                    return action
                })
                icon = this.core.manager.smartobject.smartobjects.get(smartobject.id).moduleConfiguration.icon
            } else {
                
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
            this.core.logger.error("SmartObject : " + error.toString())
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
            this.core.logger.error("SmartObject : " + error.toString())
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
            this.core.logger.error("SmartObject : " + error.toString())
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
            this.core.logger.error("SmartObject : " + error.toString())
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
                            this.core.logger.warning(Package.name, "Smartobject already exist")
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
                                this.core.manager.smartobject.update(smartObjectId)
                                return {
                                    error: false,
                                    message: "",
                                    package: Package.name
                                }
                            }
                        }
                    } else {
                        this.core.logger.warning(Package.name, "Missing smartobject arguments")
                        return {
                            error: true,
                            message: "Missing smartobject arguments",
                            package: Package.name
                        }
                    }
                } else {
                    this.core.logger.warning(Package.name, "Missing smartobject reference")
                    return {
                        error: true,
                        message: "Missing smartobject reference",
                        package: Package.name
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "Missing smartobject module")
                return {
                    error: true,
                    message: "Missing smartobject module",
                    package: Package.name
                }
            }
        } catch (error) {
            this.core.logger.error("SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async delete(id) {
        try {
            let historyettingsRequest = await this.sqlSmartobjectArgument.deleteAllByField({ smartobject: id })
            if (historyettingsRequest.error) {
                return historyettingsRequest
            }
            let smartobjectRequest = await this.sqlSmartobject.deleteOne(id)
            if (smartobjectRequest.error) {
                return smartobjectRequest
            }
            return {
                error: false,
                message: "",
                package: Package.name
            }
        } catch (error) {
            this.core.logger.error("SmartObject : " + error.toString())
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
                    if (this.core.manager.smartobject.smartobjects.has(smartobjectRequest.data.id)) {
                        let instanceSmartobject = this.core.manager.smartobject.smartobjects.get(smartobjectRequest.data.id)
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
                        this.core.logger.warning(Package.name, "Smartobject " + reference + " is missing")
                        return {
                            error: true,
                            message: "Smartobject " + reference + " is not loaded",
                            package: Package.name
                        }
                    }
                } else {
                    this.core.logger.warning(Package.name, "Missing smartobject arguments when executeAction")
                    return {
                        error: true,
                        message: "Missing smartobject arguments",
                        package: Package.name
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "Missing smartobject action when executeAction")
                return {
                    error: true,
                    message: "Missing smartobject action",
                    package: Package.name
                }
            }
        } catch (error) {
            this.core.logger.error("SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async getConfiguration() {
        try {
            this.core.logger.verbose(Package.name, "Get all modules")
            let modules = []
            this.core.configuration.smartobjects.forEach(pModule => {
                try {
                    let configuration = require(pModule + "/package.json")
                    modules.push(configuration)
                } catch (error) {
                    this.core.logger.warning(Package.name, "Impossible get configuration in " + pModule + " module")
                }
            })
            return {
                error: false,
                package: Package.name,
                message: '',
                data: modules
            }
        } catch (error) {
            this.core.logger.error("SmartObject : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }


}

export default SmartObject