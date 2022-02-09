import Package from '../package'
import Controller from './Controller'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from '../utils/StackTrace'

class Smartobject extends Controller {

    constructor(smartobjectManager, userController) {
        super()
        this.smartobjectManager = smartobjectManager
        this.userController = userController
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
            return new Result(Package.name, false, "", pSmartObjects)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all smartobject")
            return new Result(Package.name, true, "Error occurred when get all smartobject")
        }
    }

    async deleteArguments(idArgument) {
        try {
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
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete smartobject argument")
            return new Result(Package.name, true, "Error occurred when delete smartobject argument")
        }
    }

    async insertArguments(idSmartobject, body) {
        try {
            let smartobjectRequest = await this.sqlSmartobject.getOne(idSmartobject)
            if (smartobjectRequest.error) {
                return smartobjectRequest
            }
            let insertRequest = await this.sqlSmartobjectArgument.insert({
                id: null,
                smartobject: idSmartobject,
                reference: body.reference,
                value: body.value
            })
            if (insertRequest.error) {
                return insertRequest
            }
            let updateRequest = await this.smartobjectManager.update(smartobjectRequest.data.id)
            if (updateRequest.error) {
                return updateRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert smartobject argument")
            return new Result(Package.name, true, "Error occurred when insert smartobject argument")
        }
    }

    async getOne(idSmartobject) {
        try {
            let smartobjectRequest = await this.sqlSmartobject.getOne(idSmartobject)
            if (smartobjectRequest.error) {
                return smartobjectRequest
            }
            if (smartobjectRequest.data === false) {
                Tracing.warning(Package.name, "Smartobject not found")
                return new Result(Package.name, true, "Smartobject not found")
            }
            let smartobject = smartobjectRequest.data
            let argumentsRequest = await this.sqlSmartobjectArgument.getAllByField({ smartobject: smartobject["id"] })
            if (argumentsRequest.error) {
                return argumentsRequest
            }
            let argumentsData = argumentsRequest.data
            let roomRequest = await this.sqlRoom.getOne(smartobject["room"])

            if (roomRequest.error) {
                return roomRequest
            }
            let room = roomRequest.data
            let smartobjectProfileRequest = await this.sqlSmartobjectProfile.getAllByField({ smartobject: smartobject["id"] })
            if (smartobjectProfileRequest.error) {
                return smartobjectProfileRequest
            }
            let profiles = smartobjectProfileRequest.data
            let actions = []
            let state = {
                status: "unknown",
                reason: "Unknown"
            }
            let icon = null
            if (this.smartobjectManager.instances.has(smartobject.id)) {
                actions = this.smartobjectManager.instances.get(smartobject.id).getActions()

                let resultState = await this.smartobjectManager.instances.get(smartobject.id).getState()
                if (resultState.error) {
                    return resultState
                }

                state = resultState.data


                icon = this.smartobjectManager.instances.get(smartobject.id).moduleConfiguration.icon
            }

            let configuration = null
            try {
                configuration = require(smartobject.module + "/package.json")
            } catch (error) { }

            return new Result(Package.name, false, "", {
                id: smartobject.id,
                icon: icon,
                module: smartobject.module,
                reference: smartobject.reference,
                lastUse: smartobject.last_use,
                arguments: argumentsData,
                actions: actions,
                profiles: profiles,
                state: state,
                room: room,
                configuration: configuration
            })
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one smartobject")
            return new Result(Package.name, true, "Error occurred when get one smartobject")
        }
    }

    getAllConfiguration() {
        try {
            let modules = []
            for (let indexPackage = 0; indexPackage < this.smartobjectManager.packages.length; indexPackage++) {
                let pPackage = this.smartobjectManager.packages[indexPackage]
                let configuration = require(pPackage + "/package.json")
                modules.push(configuration)
            }
            return new Result(Package.name, false, "", modules)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all configuration in module")
            return new Result(Package.name, true, "Error occurred when get all configuration in module")
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
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert smartobject profile")
            return new Result(Package.name, true, "Error occurred when insert smartobject profile")
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
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete smartobject profile")
            return new Result(Package.name, true, "Error occurred when delete smartobject profile")
        }

    }

    async updateLastUse(idSmartobject) {
        try {
            let updateRequest = await this.sqlSmartobject.updateAll({ last_use: "DATE:NOW" }, { id: idSmartobject })
            if (updateRequest.error) {
                return updateRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update last smartobject use")
            return new Result(Package.name, true, "Error occurred when update last smartobject use")
        }
    }

    async updateStatus(idSmartobject, status) {
        try {
            let updateRequest = await this.sqlSmartobject.updateAll({ status: status }, { id: idSmartobject })
            if (updateRequest.error) {
                return updateRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update smartobject status")
            return new Result(Package.name, true, "Error occurred when update smartobject status")
        }
    }

    async updateRoom(idSmartobject, idRoom) {
        try {
            let updateRequest = await this.sqlSmartobject.updateAll({ room: idRoom }, { id: idSmartobject })
            if (updateRequest.error) {
                return updateRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update room smartobject")
            return new Result(Package.name, true, "Error occurred when update room smartobject")
        }
    }

    async insert(body) {
        try {
            let smartobjectRequest = await this.sqlSmartobject.getOneByField({ reference: body.reference })
            if (smartobjectRequest.error) {
                return smartobjectRequest
            }
            let smartobject = smartobjectRequest.data
            if (smartobject) {
                Tracing.warning(Package.name, "Smartobject already exist")
                return new Result(Package.name, true, "Smartobject already exist")
            } else {
                let data = {
                    id: null,
                    module: body.module,
                    status: '2',
                    reference: body.reference,
                    last_use: "DATE:NOW",
                    room: body.room
                }
                let insertRequest = await this.sqlSmartobject.insert(data)
                if (insertRequest.error) {
                    return insertRequest
                } else {
                    let idSmartobject = insertRequest.data.insertId
                    for (let index = 0; index < body.settings.length; index++) {
                        let setting = body.settings[index]
                        let insertSettngsRequest = await this.sqlSmartobjectArgument.insert({
                            id: null,
                            smartobject: idSmartobject,
                            reference: setting.reference,
                            value: setting.value
                        })
                        if (insertSettngsRequest.error) {
                            return insertSettngsRequest
                        }
                    }
                    this.smartobjectManager.update(idSmartobject)
                    return this.getOne(idSmartobject)
                }
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert smartobject")
            return new Result(Package.name, true, "Error occurred when insert smartobject")
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
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete smartobject")
            return new Result(Package.name, true, "Error occurred when delete smartobject")
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

    async executeAction(idSmartobject, idAction, idProfile, pArguments, force = false, idUser = 0) {
        try {
            if (idAction) {
                if (idProfile) {
                    let smartobjectRequest = await this.sqlSmartobject.getOne(idSmartobject)
                    if (smartobjectRequest.error) {
                        return smartobjectRequest
                    }
                    if (smartobjectRequest.data == false) {
                        return new Result(Package.name, true, "Smartobject not found")
                    }
                    if (this.smartobjectManager.instances.has(smartobjectRequest.data.id)) {
                        let instanceSmartobject = this.smartobjectManager.instances.get(smartobjectRequest.data.id)
                        let smartobject = await this.getOne(instanceSmartobject.id)
                        if (this.isAllow(smartobject.data, idProfile, force)) {
                            let resultAction = instanceSmartobject.action(idAction, pArguments)
                            if (resultAction.error) {
                                return resultAction
                            }
                            if (idUser != 0) {
                                let resultHistory = await this.userController.insertHistory(idUser, "EXECUTE", smartobject.data.reference + " - " + idAction)
                                if (resultHistory.error) {
                                    return resultHistory
                                }
                            }
                            return resultAction
                        } else {
                            Tracing.warning(Package.name, "Not allowed")
                            return new Result(Package.name, true, "You are not allowed")
                        }
                    } else {
                        Tracing.warning(Package.name, "Smartobject missing")
                        return new Result(Package.name, true, "Smartobject missing")
                    }
                } else {
                    Tracing.warning(Package.name, "Missing argument")
                    return new Result(Package.name, true, "Missing arguments")
                }
            } else {
                Tracing.warning(Package.name, "Missing action")
                return new Result(Package.name, true, "Missing action")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when execute smartobject action")
            return new Result(Package.name, true, "Error occurred when execute smartobject action")
        }
    }



}

export default Smartobject