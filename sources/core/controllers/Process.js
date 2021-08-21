import Controller from "./Controller"
import Package from '../package.json'

class Process extends Controller {

    async getOne(idProcess) {
        let processRequest = await this.sqlProcess.getOne(idProcess)
        if (processRequest.error) {
            return processRequest
        }
        if (processRequest.data === false) {
            return {
                error: true,
                message: "Process not found",
                code: Package.name + ">Process>NotFound"
            }
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
        return {
            error: false,
            message: '',
            code: 'ok',
            data: process
        }
    }

    async getAll() {
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
            return {
                error: false,
                message: '',
                code: 'ok',
                data: tmpProcesss
            }
        }
    }

    async delete(idProcess) {
        let processActionRequest = await this.sqlProcessAction.getAllByField({ process: idProcess })
        if (processActionRequest.error) {
            return processActionRequest
        }
        for (let indexProcess = 0; indexProcess < processActionRequest.data.length; indexProcess++) {
            let action = processActionRequest.data[indexProcess];
            await this.sqlProcessActionArgument.deleteAllByField({ process_action: action.id })
        }
        await this.sqlProcessInput.deleteAllByField({ process: idProcess })
        await this.sqlProcessAction.deleteAllByField({ process: idProcess })
        await this.sqlProcessProfile.deleteAllByField({ process: idProcess })
        await this.sqlProcess.deleteOne(idProcess)
        return {
            error: false,
            message: '',
            code: 'ok'
        }
    }

    
    async insertProcessProfile(idProcess,idProfile) {
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
        return {
            error: false,
            message: '',
            code: 'ok'
        }
    }

    async deleteProcessProfile(idProcess,idProfile) {
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
        if (profile) {
            let deleteProfileRequest = await this.sqlProcessProfile.deleteAllByField({ id: profile.id })
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
        let processRequest = await this.getOne(idProcess, profile, force)
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
                this.core.logger.verbose(Package.name, "Argument inflate " + JSON.stringify(pArguments))
                if (action.enable === process.enable || process.mode === "simple") {
                    if (action.type === "smartobject") {
                        let Smartobject = await this.sqlSmartobject.getOne(action.object)
                        if (Smartobject.error) {
                            return Smartobject
                        }
                        let resultAction = await this.core.manager.smartobject.smartobjects.get(Smartobject.data.reference).action(action.action, pArguments)
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
                        this.core.logger.error(Package.name, "Invalid type '" + action.type + "'")
                        return {
                            error: true,
                            message: "Invalid type '" + action.type + "'",
                            code: Package.name + '>Type>Invalid'
                        }
                    }
                }
            }
            if (process.mode === "switch") {
                await this.sqlProcess.updateAll({ enable: process.enable == 0 ? 1 : 0 }, { id: process.id })
            }
            return {
                error: false,
                message: '',
                code: 'ok',
                data: data
            }
        } else {
            return {
                error: true,
                message: "You are not allowed",
                code: Package.name + ">forbiden"
            }
        }
    }

    async insert(reference,name,nameEnable,nameDisable,description, espace, icon, mode, sources, inputs) {
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
        return {
            error: false,
            message: '',
            code: 'ok'
        }
    }

    async insertAction(idProcess, source,action,enable, pArguments) {
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
        return {
            error: false,
            message: "",
            code: "ok"
        }
    }

    async deleteAction(idProcess, idAction) {
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
        return {
            error: false,
            message: "",
            code: "ok"
        }
    }

    async insertInput(idProcess,reference,name,type,enable) {
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
                                return {
                                    error: false,
                                    message: "",
                                    code: "ok"
                                }
                            } else {
                                this.core.logger.warning(Package.name + ">insertInput>alreadyExist", "Reference already exist")
                                return {
                                    error: true,
                                    message: "Reference already exist",
                                    code: Package.name + ">insertInput>alreadyExist"
                                }
                            }
                        } else {
                            this.core.logger.warning(Package.name + ">insertInput>missingParameter", "Missing process settings enable")
                            return {
                                error: true,
                                message: "Missing process settings enable",
                                code: Package.name + ">insertInput>missingParameter"
                            }
                        }
                    } else {
                        this.core.logger.warning(Package.name + ">insertInput>missingParameter", "Missing process settings type")
                        return {
                            error: true,
                            message: "Missing process settings type",
                            code: Package.name + ">insertInput>missingParameter"
                        }
                    }
                } else {
                    this.core.logger.warning(Package.name + ">insertInput>missingParameter", "Missing process settings name")
                    return {
                        error: true,
                        message: "Missing process settings name",
                        code: Package.name + ">insertInput>missingParameter"
                    }
                }
            } else {
                this.core.logger.warning(Package.name + ">insertInput>missingParameter", "Missing process settings reference")
                return {
                    error: true,
                    message: "Missing process settings reference",
                    code: Package.name + ">insertInput>missingParameter"
                }
            }
        } else {
            this.core.logger.warning(Package.name + ">insertInput>missingParameter", "Missing process settings id")
            return {
                error: true,
                message: "Missing process settings id",
                code: Package.name + ">insertInput>missingParameter"
            }
        }
    }

    async deleteInput(idProcess,idInput) {
        let deleteInputRequest = await this.sqlProcessInput.deleteAllByField({
            reference: idInput,
            process: idProcess
        })
        if (deleteInputRequest.error) {
            return deleteInputRequest
        }
        return {
            error: false,
            message: "",
            code: "ok"
        }
    }

}

export default Process