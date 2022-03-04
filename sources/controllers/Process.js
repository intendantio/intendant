import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from "../utils/StackTrace"
import { lutimes } from "fs-extra"

class Process extends Controller {

    async getOne(idProcess) {
        try {
            let processRequest = await this.sqlProcess.getOne(idProcess)
            if (processRequest.error) {
                return processRequest
            }
            if (processRequest.data === false) {
                return new Result(Package.name, true, "Process not found")
            }
            let actionRequest = await this.sqlProcessAction.getAllByField({ process: idProcess })
            if (actionRequest.error) {
                return actionRequest
            }
            let actions = []
            for (let indexAction = 0; indexAction < actionRequest.data.length; indexAction++) {
                let action = actionRequest.data[indexAction]
                let actionArgumentRequest = await this.sqlProcessActionArgument.getAllByField({ process_action: action.id })
                if (actionArgumentRequest.error) {
                    return actionArgumentRequest
                }
                action.arguments = actionArgumentRequest.data
                actions.push(action)
            }
            let inputRequest = await this.sqlProcessInput.getAllByField({ process: idProcess })
            if (inputRequest.error) {
                return inputRequest
            }
            
            let inputs = []
            for (let indexInput = 0; indexInput < inputRequest.data.length; indexInput++) {
                let input = inputRequest.data[indexInput]
                let processInputOptionRequest = await this.sqlProcessInputOption.getAllByField({ process_input: input.id })
                if (processInputOptionRequest.error) {
                    return processInputOptionRequest
                }
                input.options = {}

                for (let indexInputOption = 0; indexInputOption < processInputOptionRequest.data.length; indexInputOption++) {
                    let inputOption = processInputOptionRequest.data[indexInputOption]
                    input.options[inputOption.reference] = inputOption.value
                }

                inputs.push(input)
            }
            

            let processProfileRequest = await this.sqlProcessProfile.getAllByField({ process: idProcess })
            if (processProfileRequest.error) {
                return processProfileRequest
            }
            let process = processRequest.data
            process.inputs = inputs
            process.actions = actions
            process.profiles = processProfileRequest.data
            return new Result(Package.name, false, "", process)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one process")
            return new Result(Package.name, true, "Error occurred when get one process")
        }
    }

    async getAll() {
        try {
            let processRequest = await this.sqlProcess.getAll()
            if (processRequest.error) {
                return processRequest
            } else {
                let tmpProcesss = []
                let processs = processRequest.data
                for (let processIndex = 0; processIndex < processs.length; processIndex++) {
                    let process = processs[processIndex]
                    let resultProcess = await this.getOne(process.id)
                    if (resultProcess.error) {
                        return resultProcess
                    }
                    tmpProcesss.push(resultProcess.data)
                }
                return new Result(Package.name, false, "", tmpProcesss)
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all process")
            return new Result(Package.name, true, "Error occurred when get all process")
        }
    }

    async delete(idProcess) {
        try {
            let processActionRequest = await this.sqlProcessAction.getAllByField({ process: idProcess })
            if (processActionRequest.error) {
                return processActionRequest
            }
            for (let indexProcess = 0; indexProcess < processActionRequest.data.length; indexProcess++) {
                let action = processActionRequest.data[indexProcess];
                let processActionArgumentRequest = await this.sqlProcessActionArgument.deleteAllByField({ process_action: action.id })
                if (processActionArgumentRequest.error) {
                    return processActionArgumentRequest
                }
            }
            await this.sqlProcessInput.deleteAllByField({ process: idProcess })
            await this.sqlProcessAction.deleteAllByField({ process: idProcess })
            await this.sqlProcessProfile.deleteAllByField({ process: idProcess })
            await this.sqlProcess.deleteOne(idProcess)
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete one process")
            return new Result(Package.name, true, "Error occurred when delete one process")
        }
    }

    async insertProcessProfile(idProcess, idProfile) {
        try {
            let ProcessRequest = await this.sqlProcess.getOne(idProcess)
            if (ProcessRequest.error) {
                return ProcessRequest
            }
            let Process = ProcessRequest.data
            let profileRequest = await this.sqlProcessProfile.getOneByField({ Process: idProcess, profile: idProfile })
            if (profileRequest.error) {
                return profileRequest
            }
            let profile = profileRequest.data
            if (profile === false) {
                let insertProfile = await this.sqlProcessProfile.insert({ id: null, Process: Process.id, profile: idProfile })
                if (insertProfile.error) {
                    return insertProfile
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert process profile")
            return new Result(Package.name, true, "Error occurred when insert process profile")
        }
    }

    async deleteProcessProfile(idProcess, idProfile) {
        try {
            let ProcessRequest = await this.sqlProcess.getOne(idProcess)
            if (ProcessRequest.error) {
                return ProcessRequest
            }
            let profileRequest = await this.sqlProcessProfile.getOneByField({ Process: idProcess, profile: idProfile })
            if (profileRequest.error) {
                return profileRequest
            }
            let profile = profileRequest.data
            if (profile) {
                let deleteProfileRequest = await this.sqlProcessProfile.deleteAllByField({ id: profile.id })
                if (deleteProfileRequest.error) {
                    return deleteProfileRequest
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete process profile")
            return new Result(Package.name, true, "Error occurred when delete process profile")
        }
    }

    isAllow(process, profile, force = false) {
        let allow = false
        process.profiles.forEach(pprofile => {
            if (pprofile.profile == profile) {
                allow = true
            }
        })
        return allow || force
    }

    async executeAction(idProcess, profile, inputs, force = false) {
        try {
            let processRequest = await this.getOne(idProcess)
            if (processRequest.error) {
                return processRequest
            }
            let process = processRequest.data
            if (this.isAllow(process, profile, force)) {
                let actions = process.actions
                let data = []
                for (let index = 0; index < actions.length; index++) {
                    const action = actions[index]
                    let pArguments = {}
                    action.arguments.forEach(argument => {
                        for (let inputKey in inputs) {
                            let input = inputs[inputKey]
                            if(input == null) {
                                argument.value = argument.value.replace("{" + inputKey + "}", argument.default_value) 
                            } else {
                                argument.value = argument.value.replace("{" + inputKey + "}", input)
                            }
                        }
                        pArguments[argument.reference] = argument.value
                    })
                    if (action.state === process.state) {
                        if (action.type === "smartobject") {
                            let getOneSmartobject = await this.sqlSmartobject.getOne(action.object)
                            if (getOneSmartobject.error) {
                                return getOneSmartobject
                            }
                            let resultAction = await this.smartobjectManager.instances.get(getOneSmartobject.data.id).action(action.action, pArguments)
                            if (resultAction.error) {
                                return resultAction
                            }
                            data.push(resultAction.data)
                        } else if (action.type === "module") {
                            let resultAction = await this.moduleManager.executeAction(action.object, action.action, pArguments)
                            if (resultAction.error) {
                                return resultAction
                            }
                            data.push(resultAction.data)
                        } else if (action.type === "essential") {
                            let resultAction = await this.essentialController.executeAction(action.action, pArguments)
                            if (resultAction.error) {
                                return resultAction
                            }
                            data.push(resultAction.data)
                        } else {
                            Tracing.error(Package.name, "Invalid action type")
                            return new Result(Package.name, false, "Invalid action type")
                        }
                    }
                }
                if (process.mode === "switch") {
                    await this.sqlProcess.updateAll({ state: process.state == "on" ? "off" : "on" }, { id: process.id })
                }
                return new Result(Package.name, false, "", data)
            } else {
                return new Result(Package.name, true, "You are not allowed")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when execute process")
            return new Result(Package.name, true, "Error occurred when execute process")
        }
    }

    async insert(pProcess) {
        try {
            let insertProcessRequest = await this.sqlProcess.insert({
                id: null,
                description: pProcess.description,
                description_on: pProcess.description_on,
                description_off: pProcess.description_off,
                mode: pProcess.mode,
                room: pProcess.room,
                state: pProcess.state
            })
            if (insertProcessRequest.error) {
                return insertProcessRequest
            }
            let idProcess = insertProcessRequest.data.insertId
            for (let indexAction = 0; indexAction < pProcess.actions.length; indexAction++) {
                let action = pProcess.actions[indexAction]
                let insertProcessActionRequest = await this.sqlProcessAction.insert({
                    id: null,
                    process: idProcess,
                    type: action.type,
                    object: action.object,
                    action: action.action,
                    state: action.state
                })
                if (insertProcessActionRequest.error) {
                    return insertProcessActionRequest
                }
                let idProcessAction = insertProcessActionRequest.data.insertId
                for (let indexArgument = 0; indexArgument < action.settings.length; indexArgument++) {
                    let setting = action.settings[indexArgument]
                    let insertSettingsRequest = await this.sqlProcessActionArgument.insert({
                        id: null,
                        reference: setting.reference,
                        value: setting.value,
                        default_value: setting.default,
                        process_action: idProcessAction
                    })
                    if (insertSettingsRequest.error) {
                        return insertSettingsRequest
                    }
                }
            }
            for (let indexInput = 0; indexInput < pProcess.inputs.length; indexInput++) {
                let input = pProcess.inputs[indexInput]
                let insertInputRequest = await this.sqlProcessInput.insert({
                    id: null,
                    process: idProcess,
                    reference: input.reference,
                    type: input.type,
                    state: input.state
                })
                if (insertInputRequest.error) {
                    return insertInputRequest
                }
                let idInputOption = insertInputRequest.data.insertId

                for (let indexInputOption = 0; indexInputOption < input.options.length; indexInputOption++) {
                    let option = input.options[indexInputOption];
                    let insertInputOptionRequest = await this.sqlProcessInputOption.insert({
                        id: null,
                        reference: option.reference,
                        value: option.value,
                        process_input: idInputOption
                    })
                    if (insertInputOptionRequest.error) {
                        return insertInputOptionRequest
                    }
                }
            }
            return await this.getOne(idProcess)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert process")
            return new Result(Package.name, true, "Error occurred when insert process")
        }
    }

}

export default Process