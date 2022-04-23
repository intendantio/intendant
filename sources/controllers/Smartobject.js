import Package from '../package'
import Controller from './Controller'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from '../utils/StackTrace'
import Parser from '../utils/Parser'
import Moment from 'moment'
import fs from 'fs'
import fetch from 'node-fetch'
import { exec } from 'child_process'
import Utils from '../utils/Utils'
import fsExtra from 'fs-extra'

class Smartobject extends Controller {

    async install(pPackage) {
        try {

            if (fs.existsSync("./node_modules/" + pPackage)) {
                fsExtra.removeSync("./node_modules/" + pPackage)
            }

            Tracing.verbose(Package.name, "Download list from https://market.intendant.io/smartobjects.json")
            let resultMarket = await fetch("https://market.intendant.io/smartobjects.json", {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': 0
                }
            })
            let resultMarketJSON = await resultMarket.json()
            resultMarketJSON = resultMarketJSON.filter(item => {
                return item.name == pPackage
            })
            if (resultMarketJSON.length == 0) {
                Tracing.warning(Package.name, "Package not found " + pPackage)
                return new Result(Package.name, true, "Package not found " + pPackage)
            } else if (resultMarketJSON.length > 1) {
                Tracing.warning(Package.name, "Package not found " + pPackage)
                return new Result(Package.name, true, "Package not found " + pPackage)
            } else {
                let item = resultMarketJSON[0]

                let resultRaw = await fetch(item.raw, {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': 0
                    }
                })
                let resultRawJson = {}
                try {
                    resultRawJson = await resultRaw.json()
                } catch (error) {
                    Tracing.warning(Package.name, "File not found " + item.raw)
                    return new Result(Package.name, true, "Invalid release file " + pPackage)

                }
                if (Utils.isCompatible(Package.version, resultRawJson.core)) {
                    Tracing.verbose(Package.name, "Install " + item.name)
                    await new Promise((resolve, reject) => {
                        exec("npm install " + resultRawJson.url + " -s --silent 2>&1 | tee t", (e, std, ster) => {
                            resolve()
                        })
                    })

                    this.smartobjectManager.packages.push(item.name)
                    await this.smartobjectManager.restart()

                    return new Result(Package.name, false, "")
                } else {
                    Tracing.warning(Package.name, "Core must have a minimum version of " + resultRawJson.core + " to accept the module")
                    return new Result(Package.name, true, "Core must have a minimum version of " + resultRawJson.core + " to accept the module")
                }
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when install package smartobject")
            return new Result(Package.name, true, "Error occurred when install package smartobject")
        }
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

            let actions = []
            let widgets = []
            let dataSources = []
            let triggers = []

            let configuration = false

            if (this.smartobjectManager.instances.has(parseInt(smartobject.id))) {
                configuration = JSON.parse(fs.readFileSync("./node_modules/" + smartobject.module + "/package.json").toString())
                actions = this.smartobjectManager.instances.get(parseInt(smartobject.id)).getActions()
                widgets = this.smartobjectManager.instances.get(parseInt(smartobject.id)).getWidgets()
                dataSources = this.smartobjectManager.instances.get(parseInt(smartobject.id)).getDataSources()
                triggers = this.smartobjectManager.instances.get(parseInt(smartobject.id)).getTriggers()

            }

            let link = null

            if (smartobject.link != null) {
                let resultLink = await this.sqlLink.getOne(smartobject.link)
                if (resultLink.error) {
                    return resultLink
                }
                link = resultLink.data
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
                link: link,
                state: {
                    status: "online"
                },
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

    async getState(idSmartobject) {
        try {
            if (this.smartobjectManager.instances.has(parseInt(idSmartobject))) {
                return await this.smartobjectManager.instances.get(parseInt(idSmartobject)).getState()
            } else {
                return new Result(Package.name, true, "Smartobject not found")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all state in module")
            return new Result(Package.name, true, "Error occurred when get all state in module")
        }
    }

    async updateLastUse(idSmartobject) {
        try {
            let result = await this.sqlSmartobject.updateAll({ last_use: Moment().valueOf() }, { id: idSmartobject })
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

    async updateLink(idSmartobject, idLink) {
        try {
            let result = await this.sqlSmartobject.updateAll({ link: idLink }, { id: idSmartobject })
            if (result.error) {
                return result
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update link smartobject")
            return new Result(Package.name, true, "Error occurred when update link smartobject")
        }
    }

    async updateArgument(idSmartobject, reference, value) {
        try {
            let result = await this.sqlSmartobjectArgument.updateAll({ value: Parser.stringify(value) }, { reference: reference, smartobject: idSmartobject })
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
                let data = { module: pModule, status: 2, reference: reference, last_use: Moment().valueOf(), room: room }
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

    async regenerate(idSmartobject, settings) {
        try {
            for (let index = 0; index < settings.length; index++) {
                let setting = settings[index]
                let result = await this.updateArgument(idSmartobject, setting.reference, setting.value)
                if (result.error) {
                    return result
                }
            }
            await this.smartobjectManager.update(idSmartobject)
            return this.getOne(idSmartobject)
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

    async executeAction(idSmartobject, idAction, settings, idProfile = false) {
        try {
            idSmartobject = parseInt(idSmartobject)
            if (idAction) {
                let smartobjectRequest = await this.getOne(idSmartobject)
                if (smartobjectRequest.error) { return smartobjectRequest }
                let smartobject = smartobjectRequest.data
                if (idProfile) {
                    let resultRoomProfile = await this.sqlRoomProfile.getOneByField({ room: smartobject.room.id, profile: idProfile })
                    if (resultRoomProfile.error) {
                        return resultRoomProfile
                    }
                    if (resultRoomProfile.data == false) {
                        Tracing.warning(Package.name, "Not allowed at " + smartobject.room.name)
                        return new Result(Package.name, true, "You do not have access to this room (" + smartobject.room.name + ")")
                    }
                }
                if (this.smartobjectManager.instances.has(idSmartobject)) {
                    let instanceSmartobject = this.smartobjectManager.instances.get(idSmartobject)
                    this.updateLastUse(idSmartobject)
                    let resultAction = instanceSmartobject.action(idAction, settings)
                    if (resultAction.error) {
                        return resultAction
                    }
                    return resultAction
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

    async getSyncData() {
        let resultSmartobject = await this.getAll()
        let syncData = []
        resultSmartobject.data.forEach(smartobject => {
            if (smartobject.configuration.assistant) {
                console.log(smartobject.link)
                syncData.push({
                    id: smartobject.id + "-" + smartobject.room.name + "-" + (smartobject.link ? smartobject.link.name : "default"),
                    type: smartobject.configuration.assistant.type,
                    traits: smartobject.configuration.assistant.traits,
                    attributes: smartobject.configuration.assistant.attributes,
                    name: {
                        defaultNames: [smartobject.reference],
                        name: smartobject.reference
                    },
                    roomHint: smartobject.room.name,
                    structureHint: smartobject.link ? smartobject.link.name : null,
                    willReportState: true
                })
            }
        })
        return {
            error: false,
            message: "",
            package: Package.name,
            data: syncData
        }
    }

    async getSyncQuery(settings = {}) {
        let requestId = settings.requestId
        let inputs = settings.inputs
        let currentStates = {}
        Tracing.verbose(Package.name, "Get SYNC QUERY ")
        Tracing.verbose(Package.name, JSON.stringify(settings.inputs))

        for (let indexInput = 0; indexInput < inputs.length; indexInput++) {
            let input = inputs[indexInput]
            if (input.intent == "action.devices.QUERY") {
                for (let indexDevices = 0; indexDevices < input.payload.devices.length; indexDevices++) {
                    try {

                        let idSmartobject = input.payload.devices[indexDevices].id.split("-")[0]
                        let resultState = await this.getState(idSmartobject)
                        if (resultState.error) {

                        } else {
                            let currentState = resultState.data.state
                            currentState.status = resultState.data.status
                            currentState.online = true
                            currentStates[input.payload.devices[indexDevices].id] = currentState
                        }
                    } catch (error) {
                        console.log(error)
                        console.log(input.payload.devices[indexDevices].id)
                    }
                }
            }
        }
        Tracing.verbose(Package.name, "Result SYNC QUERY ")
        return {
            error: false,
            message: "",
            package: Package.name,
            data: {
                devices: currentStates
            }
        }
    }

    async getSyncExecute(settings = {}) {
        let requestId = settings.requestId
        settings.inputs.forEach(input => {
            console.log(input.context)
            console.log(input.intent)
            input.payload.commands.forEach(command => {
                command.devices.forEach(device => {
                    command.execution.forEach(async exec => {
                        let idSmartobject = parseInt(device.id.split("-")[0]) 
                        if (this.smartobjectManager.instances.has(idSmartobject)) {

                            let smartobject = this.smartobjectManager.instances.get(idSmartobject)

                            let resultExecute = await smartobject.executeAssistant(exec.command,exec.params)
                        }

                    })
                })
            })
        })

        Tracing.verbose(Package.name, "Get SYNC EXECUTE ")
        return {
            error: false,
            message: "",
            package: Package.name,
            data: {
                devices: {}
            }
        }
    }

}

export default Smartobject