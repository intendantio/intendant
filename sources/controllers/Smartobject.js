import Package from '../package'
import Controller from './Controller'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from '../utils/StackTrace'
import Parser from '../utils/Parser'

class Smartobject extends Controller {

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
            let argumentsRequest = await this.sqlSmartobjectArgument.getAllByField({ smartobject: idSmartobject })
            if (argumentsRequest.error) {
                return argumentsRequest
            }
            let argumentsData = argumentsRequest.data.map(argument => {
                argument.value = Parser.parse(argument.value)
                return argument
            })

            let roomRequest = await this.sqlRoom.getOne(smartobject.room)

            if (roomRequest.error) {
                return roomRequest
            }

            let room = roomRequest.data
            let configuration = require(smartobject.module + "/package.json")

            let smartobjectProfileRequest = await this.sqlSmartobjectProfile.getAllByField({ smartobject: idSmartobject })
            if (smartobjectProfileRequest.error) {
                return smartobjectProfileRequest
            }
            let profiles = smartobjectProfileRequest.data
            let actions = []
            let widgets = []
            let dataSources = []
            let triggers = []
            let state = {
                status: "unknown",
                reason: "Unknown"
            }

            if (this.smartobjectManager.instances.has(parseInt(smartobject.id))) {
                actions = this.smartobjectManager.instances.get(parseInt(smartobject.id)).getActions()
                if(actions == undefined) {
                    console.log(this.smartobjectManager.instances.get(parseInt(smartobject.id)).getActions)
                }
                widgets = this.smartobjectManager.instances.get(parseInt(smartobject.id)).getWidgets()
                dataSources = this.smartobjectManager.instances.get(parseInt(smartobject.id)).getDataSources()
                triggers = this.smartobjectManager.instances.get(parseInt(smartobject.id)).getTriggers()

                let resultState = await this.smartobjectManager.instances.get(parseInt(smartobject.id)).getState()
                if (resultState.error) {
                    return resultState
                }
                state = resultState.data
            } else {
                Tracing.warning(Package.name, "Smartobject n°" + smartobject.id + " was not instanciate")
            }



            return new Result(Package.name, false, "", {
                id: smartobject.id,
                module: smartobject.module,
                reference: smartobject.reference,
                lastUse: smartobject.last_use,
                arguments: argumentsData,
                actions: actions,
                widgets: widgets,
                dataSources: dataSources,
                triggers: triggers,
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
            let configurations = []
            for (let indexPackage = 0; indexPackage < this.smartobjectManager.packages.length; indexPackage++) {
                let pPackage = this.smartobjectManager.packages[indexPackage]
                let configuration = require(pPackage + "/package.json")
                configurations.push(configuration)
            }
            return new Result(Package.name, false, "", configurations)
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
            let result = await this.sqlSmartobject.updateAll({ last_use: "DATE:NOW" }, { id: idSmartobject })
            if (result.error) {
                return result
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
            let result = await this.sqlSmartobject.updateAll({ room: idRoom }, { id: idSmartobject })
            if (result.error) {
                return result
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update room smartobject")
            return new Result(Package.name, true, "Error occurred when update room smartobject")
        }
    }

    async updateArgument(idSmartobject, reference, value) {
        try {
            let result = await this.sqlSmartobjectArgument.updateAll({ reference: reference, smartobject: idSmartobject }, { value: value })
            if (result.error) {
                return result
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update arguments smartobject")
            return new Result(Package.name, true, "Error occurred when update arguments smartobject")
        }
    }

    async updateReference(idSmartobject, reference) {
        try {
            let result = await this.sqlSmartobject.updateAll({ reference: reference }, { id: idSmartobject })
            if (result.error) {
                return result
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update room smartobject")
            return new Result(Package.name, true, "Error occurred when update room smartobject")
        }
    }

    async insert(reference, pModule, room, settings) {
        try {
            let smartobjectRequest = await this.sqlSmartobject.getOneByField({ reference: reference })
            if (smartobjectRequest.error) {
                return smartobjectRequest
            }
            let smartobject = smartobjectRequest.data
            if (smartobject) {
                Tracing.warning(Package.name, "Smartobject already exist")
                return new Result(Package.name, true, "Smartobject already exist")
            } else {
                let data = { module: pModule, status: 2, reference: reference, last_use: "", room: room }
                let insertRequest = await this.sqlSmartobject.insert(data)
                if (insertRequest.error) {
                    return insertRequest
                } else {
                    let idSmartobject = insertRequest.data.insertId
                    for (let index = 0; index < settings.length; index++) {
                        let setting = settings[index]
                        let insertSettngsRequest = await this.sqlSmartobjectArgument.insert({
                            smartobject: idSmartobject,
                            reference: setting.reference,
                            value: Parser.stringify(setting.value)
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
            /* Check process */
            let resultProcessAction = await this.sqlProcessAction.count({ type: "smartobject", object: idSmartobject })
            if (resultProcessAction.error) {
                return resultProcessAction
            }
            if (resultProcessAction.data.count > 0) {
                return new Result(Package.name, true, "Impossible to delete this smartobject that is used in a process")
            }

            /* Check rapport */
            let resultRapport = await this.sqlRapport.count({ type: "smartobject", object: idSmartobject })
            if (resultRapport.error) {
                return resultRapport
            }
            if (resultRapport.data.count > 0) {
                return new Result(Package.name, true, "Impossible to delete this smartobject that is used in a rapport")
            }

            /* Check widget */
            let resultWidget = await this.sqlWidget.count({ type: "smartobject", object: idSmartobject })
            if (resultWidget.error) {
                return resultWidget
            }
            if (resultWidget.data.count > 0) {
                return new Result(Package.name, true, "Impossible to delete this smartobject that is used in a widget")
            }

            /* Check automation */
            let resultAutomationTrigger = await this.sqlAutomationTrigger.count({ type: "smartobject", object: idSmartobject })
            if (resultAutomationTrigger.error) {
                return resultAutomationTrigger
            }
            if (resultAutomationTrigger.data.count > 0) {
                return new Result(Package.name, true, "Impossible to delete this smartobject that is used in a automation")
            }
            let resultAutomationAction = await this.sqlAutomationAction.count({ type: "smartobject", object: idSmartobject })
            if (resultAutomationAction.error) {
                return resultAutomationAction
            }
            if (resultAutomationAction.data.count > 0) {
                return new Result(Package.name, true, "Impossible to delete this smartobject that is used in a automation")
            }

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

    async executeAction(idSmartobject, idAction, idProfile = 1, pArguments, force = false, idUser = 0) {
        try {
            if (idAction) {
                let smartobjectRequest = await this.getOne(idSmartobject)
                if (smartobjectRequest.error) {
                    return smartobjectRequest
                }
                let smartobject = smartobjectRequest.data
                if (this.smartobjectManager.instances.has(parseInt(idSmartobject))) {
                    let instanceSmartobject = this.smartobjectManager.instances.get(parseInt(idSmartobject))
                    if (true) {
                        this.updateLastUse(idSmartobject)
                        let resultAction = instanceSmartobject.action(idAction, pArguments)
                        if (resultAction.error) {
                            return resultAction
                        }
                        if (idUser != 0) {
                            let resultHistory = await this.userController.insertHistory(idUser, "EXECUTE", smartobject.reference + " - " + idAction)
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