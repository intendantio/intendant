import Controller from './Controller'
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from '../utils/StackTrace'

class Automation extends Controller {

    async getAll() {
        try {
            let automationsRequest = await this.sqlAutomation.getAll()
            if (automationsRequest.error) {
                return automationsRequest
            }
            let automations = []
            for (let index = 0; index < automationsRequest.data.length; index++) {
                let automation = automationsRequest.data[index]
                let resultAutomation = await this.getOne(automation.id)
                if (resultAutomation.error) {
                    return resultAutomation
                }
                automations.push(resultAutomation.data)
            }
            return new Result(Package.name, false, "", automations)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all automation")
            return new Result(Package.name, true, "Error occurred when get all automation")
        }
    }

    async getOne(idAutomation) {
        try {
            let automationRequest = await this.sqlAutomation.getOne(idAutomation)
            if (automationRequest.error) {
                return automationRequest
            }
            if (automationRequest.data === false) {
                Tracing.warning(Package.name, "Automation not found")
                return new Result(Package.name, true, "Automation not found")
            }
            let automation = automationRequest.data
            let automationTriggerRequest = await this.sqlAutomationTrigger.getOneByField({ automation: automation.id })
            if (automationTriggerRequest.error) {
                return automationTriggerRequest
            }
            if (automationTriggerRequest.data == false) {
                Tracing.warning(Package.name, "Automation trigger not found")
                return new Result(Package.name, true, "Automation trigger not found")
            }
            let automationActionRequest = await this.sqlAutomationAction.getOneByField({ automation: automation.id })
            if (automationActionRequest.error) {
                return automationActionRequest
            }
            if (automationActionRequest.data == false) {
                Tracing.warning(Package.name, "Automation action not found")
                return new Result(Package.name, true, "Automation action not found")
            }
            let automationActionArgumentRequest = await this.sqlAutomationActionArgument.getAllByField({ automation_action: automationActionRequest.data.id })
            if (automationActionArgumentRequest.error) {
                return automationActionArgumentRequest
            }
            automation.trigger = automationTriggerRequest.data
            automation.action = automationActionRequest.data
            automation.action.settings = automationActionArgumentRequest.data
            return new Result(Package.name, false, "", automation)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one automation")
            return new Result(Package.name, true, "Error occurred when get one automation")
        }
    }

    async insert(description, trigger, action) {
        try {
            let resultInsert = await this.sqlAutomation.insert({ reference: description })
            if (resultInsert.error) {
                return resultInsert
            }
            let idAutomation = resultInsert.data.insertId
            let resultInsertTrigger = await this.sqlAutomationTrigger.insert({
                automation: idAutomation,
                type: trigger.type,
                object: trigger.object,
                trigger: trigger.trigger
            })
            if (resultInsertTrigger.error) {
                return resultInsertTrigger
            }
            let resultInsertAction = await this.sqlAutomationAction.insert({
                automation: idAutomation,
                type: action.type,
                object: action.object,
                action: action.action
            })
            if (resultInsertAction.error) {
                return resultInsertAction
            }
            let idAutomationAction = resultInsertAction.data.insertId
            for (let index = 0; index < action.settings.length; index++) {
                let setting = action.settings[index]
                let resultInsertActionArgument = await this.sqlAutomationActionArgument.insert({
                    reference: setting.reference,
                    value: setting.value,
                    automation_action: idAutomationAction
                })
                if (resultInsertActionArgument.error) {
                    return resultInsertActionArgument
                }
            }
            await this.automationManager.before()
            return await this.getOne(idAutomation)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert automation")
            return new Result(Package.name, true, "Error occurred when insert automation")
        }
    }

    async delete(idAutomation) {
        try {
            let removeInstance = await this.automationManager.removeInstance(parseInt(idAutomation))
            if (removeInstance.error) {
                return removeInstance
            }
            let automationActionRequest = await this.sqlAutomationAction.getAllByField({ automation: idAutomation })
            if (automationActionRequest.error) {
                return automationActionRequest
            }
            for (let indexAutomation = 0; indexAutomation < automationActionRequest.data.length; indexAutomation++) {
                let action = automationActionRequest.data[indexAutomation];
                let automationActionArgumentRequest = await this.sqlAutomationActionArgument.deleteAllByField({ automation_action: action.id })
                if (automationActionArgumentRequest.error) {
                    return automationActionArgumentRequest
                }
            }
            await this.sqlAutomationAction.deleteAllByField({ automation: idAutomation })
            await this.sqlAutomationTrigger.deleteAllByField({ automation: idAutomation })
            await this.sqlAutomation.deleteOne(idAutomation)
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete automation")
            return new Result(Package.name, true, "Error occurred when delete automation")
        }
    }

}

export default Automation