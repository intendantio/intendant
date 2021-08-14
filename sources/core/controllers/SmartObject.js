import Package from '../package'
import Controller from './Controller'

class SmartObject extends Controller {

    async getAll() {
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
            code: 'ok',
            message: '',
            data: pSmartObjects
        }
    }

    async deleteSettings(idSetting) {
        let getRequest = await this.sqlSmartobjectArgument.getOne(idSetting)
        if (getRequest.error) {
            return getRequest
        }
        let smartobjectArgument = getRequest.data
        let deleteAllRequest = await this.sqlSmartobjectArgument.deleteAllByField({
            id: idSetting
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
            code: "ok"
        }
    }

    async insertSettings(idSmartobject,reference,value) {
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
                    code: "ok"
                }
            } else {
                this.core.logger.warning(Package.name + ">insertSettings>missingParameter", "Missing smartobject settings value")
                return {
                    error: true,
                    message: "Missing smartobject settings value",
                    code: Package.name + ">insertSettings>missingParameter"
                }
            }
        } else {
            this.core.logger.warning(Package.name + ">insertSettings>missingParameter", "Missing smartobject settings reference")
            return {
                error: true,
                message: "Missing smartobject settings reference",
                code: Package.name + ">insertSettings>missingParameter"
            }
        }
    }

    async getOne(idSmartobject) {
        let smartobjectRequest = await this.sqlSmartobject.getOne(idSmartobject)
        if (smartobjectRequest.error) {
            return smartobjectRequest
        }
        if (smartobjectRequest.data === false) {
            return {
                error: true,
                message: "Smartobject not found",
                code: Package.name + ">Smartobject>NotFound"
            }
        }
        let smartobject = smartobjectRequest.data
        let settingsRequest = await this.sqlSmartobjectArgument.getAllByField({ smartobject: smartobject["id"] })
        if (settingsRequest.error) {
            return settingsRequest
        }
        let settings = settingsRequest.data
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
        if (this.core.manager.smartobject.smartobjects.has(smartobject.reference)) {
            actions = this.core.manager.smartobject.smartobjects.get(smartobject.reference).moduleConfiguration.actions
            actions = actions.map(action => {
                action.allow = false
                return action
            })
            icon = this.core.manager.smartobject.smartobjects.get(smartobject.reference).moduleConfiguration.icon
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
                settings: settings,
                actions: actions,
                profiles: profiles
            }
        }
    }

    async insertSmartobjectProfile(idSmartobject,idProfile) {
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
            code: 'ok'
        }
    }

    async deleteSmartobjectProfile(idSmartobject,idProfile) {
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
            code: 'ok'
        }
    }

    async updateLastUse(idSmartobject) {
        let updateRequest = await this.sqlSmartobject.updateAll({ last_use: "DATE:NOW" }, { id: idSmartobject })
        if (updateRequest.error) {
            return updateRequest
        }
        return {
            error: false,
            message: "",
            code: "ok"
        }
    }

    async insert(pModule,reference,settings) {
        if (pModule) {
            if (reference) {
                if (settings) {
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
                                code: "reference-already-exist-smartobject-parameters"
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
                                for (let index = 0; index < settings.length; index++) {
                                    let setting = settings[index]
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
                                return {
                                    error: false,
                                    message: "",
                                    code: "ok"
                                }
                            }
                        }
                } else {
                    this.core.logger.warning(Package.name, "Missing smartobject settings")
                    return {
                        error: true,
                        message: "Missing smartobject settings",
                        code: "missing-smartobject-settings"
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "Missing smartobject reference")
                return {
                    error: true,
                    message: "Missing smartobject reference",
                    code: "missing-smartobject-reference"
                }
            }
        } else {
            this.core.logger.warning(Package.name, "Missing smartobject module")
            return {
                error: true,
                message: "Missing smartobject module",
                code: "missing-smartobject-module"
            }
        }
    }

    async delete(id) {
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
            code: "ok"
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

    async executeAction(idSmartobject, idAction, idProfile, settings, force = false) {
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
                        code: Package.name + ">NotFound"
                    }
                }
                if (this.core.manager.smartobject.smartobjects.has(smartobjectRequest.data.reference)) {
                    let instanceSmartobject = this.core.manager.smartobject.smartobjects.get(smartobjectRequest.data.reference)
                    let smartobject = await this.getOne(instanceSmartobject.id)

                    if (this.isAllow(smartobject.data, idProfile, force)) {
                        return instanceSmartobject.action(idAction, settings)
                    } else {
                        return {
                            error: true,
                            message: "You are not allowed",
                            code: Package.name + ">forbiden"
                        }
                    }
                } else {
                    this.core.logger.warning(Package.name, "Smartobject " + reference + " is missing")
                    return {
                        error: true,
                        message: "Smartobject " + reference + " is not loaded",
                        code: Package.name + ">NotLoaded"
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "Missing smartobject arguments when executeAction")
                return {
                    error: true,
                    message: "Missing smartobject arguments",
                    code: Package.name + ">Missing>SmartobjectArgument"
                }
            }
        } else {
            this.core.logger.warning(Package.name, "Missing smartobject action when executeAction")
            return {
                error: true,
                message: "Missing smartobject action",
                code: "missing-smartobject-action"
            }
        }
    }

    //TODO getConfiguration
    async getConfiguration() {
        this.core.logger.verbose(Package.name, "Get all modules")
        let modules = []
        this.core.configuration.smartobjects.forEach(pModule => {
            try {
                let configuration = require(pModule + "/configuration.json")
                modules.push(configuration)
            } catch (error) {
                this.core.logger.warning(Package.name, "Impossible get configuration in " + pModule + " module")
            }
        })
        return {
            error: false,
            code: 'ok',
            message: '',
            data: modules
        }
    }


}

export default SmartObject