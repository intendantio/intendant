import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from "../utils/StackTrace"

class Process extends Controller {

    constructor(smartobjectManager, moduleManager) {
        super()
        this.moduleManager = moduleManager
        this.smartobjectManager = smartobjectManager
    }

    async getOne(idProcess) {
        try {
            let processRequest = await this.sqlProcess.getOne(idProcess)
            if (processRequest.error) {
                return processRequest
            }
            if (processRequest.data === false) {
                return new Result(Package.name, false, "Process not found")
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
            let processProfileRequest = await this.sqlProcessProfile.getAllByField({ process: idProcess })
            if (processProfileRequest.error) {
                return processProfileRequest
            }
            let espaceRequest = await this.sqlEspace.getOne(processRequest.data.espace)
            if (espaceRequest.error) {
                return espaceRequest
            }
            let process = processRequest.data
            process.actions = actions
            process.inputs = inputRequest.data.map(input => {
                input.id = input.reference
                return input
            })
            process.profiles = processProfileRequest.data
            process.espace = espaceRequest.data
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
                            argument.value = argument.value.replace("{" + inputKey + "}", input)
                        }
                        pArguments[argument.reference] = argument.value
                    })
                    if (action.enable === process.enable || process.mode === "simple") {
                        if (action.type === "smartobject") {
                            let getOneSmartobject = await this.sqlSmartobject.getOne(action.object)
                            if (getOneSmartobject.error) {
                                return getOneSmartobject
                            }
                            let resultAction = await this.core.manager.smartobject.smartobjects.get(getOneSmartobject.data.id).action(action.action, pArguments)
                            if (resultAction.error) {
                                return resultAction
                            }
                            data.push(resultAction.data)
                        } else if (action.type === "module") {
                            let resultAction = await this.core.manager.module.executeAction(action.object, action.action, pArguments)
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
                    let updateAll = await this.sqlProcess.updateAll({ enable: process.enable == 0 ? 1 : 0 }, { id: process.id })
                    if (updateAll.error) {
                        return updateAll
                    }
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

    async insert(reference, name, nameEnable, nameDisable, description, espace, icon, mode, sources, inputs) {
        try {
            let insertProcessRequest = await this.sqlProcess.insert({
                id: null,
                reference: reference,
                name: name,
                name_enable: nameEnable,
                name_disable: nameDisable,
                description: description,
                espace: espace,
                icon: icon,
                enable: '0',
                mode: mode
            })
            if (insertProcessRequest.error) {
                return insertProcessRequest
            }
            let processId = insertProcessRequest.data.insertId
            for (let indexAction = 0; indexAction < sources.length; indexAction++) {
                let action = sources[indexAction]
                let insertProcessActionRequest = await this.sqlProcessAction.insert({
                    id: null,
                    process: processId,
                    object: action.source.id,
                    action: action.action.id,
                    enable: (action.enable ? 1 : 0),
                    type: action.source.type
                })
                if (insertProcessActionRequest.error) {
                    return insertProcessActionRequest
                }
                let processActionId = insertProcessActionRequest.data.insertId
                for (let indexArgument = 0; indexArgument < action.arguments.length; indexArgument++) {
                    let argument = action.arguments[indexArgument]
                    let insertProcessActionArgumentRequest = await this.sqlProcessActionArgument.insert({
                        id: null,
                        reference: argument.reference,
                        value: argument.value,
                        process_action: processActionId
                    })
                    if (insertProcessActionArgumentRequest.error) {
                        return insertProcessActionArgumentRequest
                    }
                }
            }
            for (let indexInput = 0; indexInput < inputs.length; indexInput++) {
                let input = inputs[indexInput]
                let insertProcessInputRequest = await this.sqlProcessInput.insert({
                    id: null,
                    reference: input.reference,
                    name: input.name,
                    type: input.type,
                    enable: input.enable,
                    process: processId
                })
                if (insertProcessInputRequest.error) {
                    return insertProcessInputRequest
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert process")
            return new Result(Package.name, true, "Error occurred when insert process")
        }
    }

    async insertAction(idProcess, source, action, enable, pArguments) {
        try {
            let processRequest = await this.sqlProcess.getOne(idProcess)
            if (processRequest.error) {
                return processRequest
            }
            let process = processRequest.data
            let insertProcessActionRequest = await this.sqlProcessAction.insert({
                id: null,
                process: process.id,
                object: source.id,
                action: action.id,
                enable: (enable ? 1 : 0),
                type: source.type
            })
            if (insertProcessActionRequest.error) {
                return insertProcessActionRequest
            }
            let processActionId = insertProcessActionRequest.data.insertId
            for (let indexArgument = 0; indexArgument < pArguments.length; indexArgument++) {
                let argument = pArguments[indexArgument]
                let insertProcessActionArgumentRequest = await this.sqlProcessActionArgument.insert({
                    id: null,
                    reference: argument.reference,
                    value: argument.value,
                    process_action: processActionId
                })
                if (insertProcessActionArgumentRequest.error) {
                    return insertProcessActionArgumentRequest
                }
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert action process")
            return new Result(Package.name, true, "Error occurred when insert action process")
        }
    }

    async deleteAction(idProcess, idAction) {
        try {
            let processActionArgumentRequest = await this.sqlProcessActionArgument.deleteAllByField({
                process_action: idAction
            })
            if (processActionArgumentRequest.error) {
                return processActionArgumentRequest
            }
            let processActionRequest = await this.sqlProcessAction.deleteAllByField({
                id: idAction
            })
            if (processActionRequest.error) {
                return processActionRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete action process")
            return new Result(Package.name, true, "Error occurred when delete action process")
        }
    }

    async insertInput(idProcess, reference, name, type, enable) {
        try {
            if (idProcess) {
                if (reference) {
                    if (name) {
                        if (type) {
                            if (enable != undefined) {
                                let processRequest = await this.sqlProcess.getOne(idProcess)
                                if (processRequest.error) {
                                    return processRequest
                                }
                                let processInputRequest = await this.sqlProcessInput.getOneByField({
                                    process: idProcess,
                                    reference: reference
                                })
                                if (processInputRequest.error) {
                                    return processInputRequest
                                }
                                if (processInputRequest.data == false) {
                                    let insertRequest = await this.sqlProcessInput.insert({
                                        id: null,
                                        reference: reference,
                                        name: name,
                                        type: type,
                                        enable: enable,
                                        process: idProcess
                                    })
                                    if (insertRequest.error) {
                                        return insertRequest
                                    }
                                    return new Result(Package.name, false, "")
                                } else {
                                    Tracing.warning(Package.name, "Reference already exist")
                                    return new Result(Package.name, true, "Reference already exist")
                                }
                            } else {
                                Tracing.warning(Package.name, "Missing enable")
                                return new Result(Package.name, true, "Missing enable")
                            }
                        } else {
                            Tracing.warning(Package.name, "Missing type")
                            return new Result(Package.name, true, "Missing type")
                        }
                    } else {
                        Tracing.warning(Package.name, "Missing name")
                        return new Result(Package.name, true, "Missing name")
                    }
                } else {
                    Tracing.warning(Package.name, "Missing reference")
                    return new Result(Package.name, true, "Missing reference")
                }
            } else {
                Tracing.warning(Package.name, "Missing process id")
                return new Result(Package.name, true, "Missing process id")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert input process")
            return new Result(Package.name, true, "Error occurred when insert input process")
        }
    }

    async deleteInput(idProcess, idInput) {
        try {
            let deleteInputRequest = await this.sqlProcessInput.deleteAllByField({
                reference: idInput,
                process: idProcess
            })
            if (deleteInputRequest.error) {
                return deleteInputRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete input process")
            return new Result(Package.name, true, "Error occurred when delete input process")
        }
    }

}

export default Process