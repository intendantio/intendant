import Package from '../package.json'
import Tracing from '../utils/Tracing'
import Result from '../utils/Result'
import Manager from './Manager'
import SmartobjectManager from './Smartobject'
import Smartobject from '../controllers/Smartobject'
import AutomationController from '../controllers/Automation'
import Process from '../controllers/Process'

class Automation extends Manager {

    private smartobjectManager: SmartobjectManager
    private smartobjectController: Smartobject
    private processController: Process
    private instances: Map<Number,any>
    private automationController: AutomationController
    constructor() {
        super()
        this.instances = new Map()
    }

    async before() {
        let result = await this.automationController.getAll()
        if (result.error) {
            Tracing.error(Package.name, result.message)
            return
        }
        let automations = result.data
        automations.forEach(async automation => {
            if (this.instances.has(automation.id) == false) {
                if (automation.trigger.type == "smartobject") {
                    this.addTrigger(automation.id, automation.trigger,async () => {
                        if (automation.action.type == "smartobject") {
                            let idSmartobject = parseInt(automation.action.object)
                            if (this.smartobjectManager.instances.has(idSmartobject)) {
                                let settings = {}
                                automation.action.settings.forEach(setting => {
                                    settings[setting.reference] = setting.value
                                })
                                this.smartobjectController.executeAction(idSmartobject, automation.action.action, settings, false )
                            } else {
                                Tracing.error(Package.name, "Smartobject not instanciate")
                            }
                        } else if (automation.action.type == "process") {
                            let settings = {}
                            automation.action.settings.forEach(setting => {
                                settings[setting.reference] = setting.value
                            })
                            let resultProcess = await this.processController.getOne(automation.action.object)
                            if(resultProcess.error) {
                                Tracing.error(Package.name, resultProcess.message)
                            } else {
                                this.processController.executeAction(settings,resultProcess.data.smartobjects.map(smartobject => smartobject.id),resultProcess.data.action)
                            }
                        }
                    })
                    this.instances.set(automation.id, true)
                }
            }
        })
    }

    async addTrigger(id, trigger, callback) {
        let idSmartobject = parseInt(trigger.object)
        let smartobjectResult = await this.smartobjectController.getOne(idSmartobject)
        if (smartobjectResult.error) {
            Tracing.error(Package.name, smartobjectResult.error)
            return
        }
        if (this.smartobjectManager.instances.has(idSmartobject)) {
            let smartobject = smartobjectResult.data

            smartobject.triggers.forEach(pTrigger => {
                if (pTrigger.id == trigger.trigger) {
                    if (pTrigger.type == "callback") {
                        this.smartobjectManager.instances.get(idSmartobject).addCallback(pTrigger.id, "automation-" + id, callback)
                    }
                }
            })
        } else {
            Tracing.error(Package.name, "Smartobject not instanciate")
        }
    }

    async removeTrigger(id, trigger) {
        let idSmartobject = parseInt(trigger.object)
        let smartobjectResult = await this.smartobjectController.getOne(idSmartobject)
        if (smartobjectResult.error) {
            return smartobjectResult
        }
        if (this.smartobjectManager.instances.has(idSmartobject)) {
            let smartobject = smartobjectResult.data
            smartobject.triggers.forEach(pTrigger => {
                if (pTrigger.id == trigger.trigger) {
                    if (pTrigger.type == "callback") {
                        this.smartobjectManager.instances.get(idSmartobject).removeCallback(pTrigger.id, "automation-" + id)
                    }
                }
            })
        }
        return new Result(Package.name, false, "")
    }

    async removeInstance(id) {
        if (this.instances.has(id)) {
            let resultAutomation = await this.automationController.getOne(id)
            if (resultAutomation.error) {
                return resultAutomation
            }
            let resultRemoveTrigger = await this.removeTrigger(id, resultAutomation.data.trigger)
            if (resultRemoveTrigger.error) {
                return resultRemoveTrigger
            }
            this.instances.delete(id)
        }
        return new Result(Package.name, false, "")
    }

}


export default Automation