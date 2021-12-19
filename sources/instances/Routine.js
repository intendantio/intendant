import Package from '../package.json'
import * as ToadScheduler from 'toad-scheduler'
import Schedule from 'node-schedule'
import _ from 'lodash'
import Connector from '../connector'
import Tracing from '../utils/Tracing'

class Routine {

    constructor(routine, core) {
        this.scheduler = new ToadScheduler.ToadScheduler()
        this.job = {cancel: () => {}}
        this.core = core
        this.configuration = core.configuration
        this.id = routine.id
        this.name = routine.name
        this.triggers = routine.triggers
        this.effects = routine.effects
        this.watch = routine.watch
        this.mode = routine.mode
        this.sqlRoutine = new Connector("routine")
        if (this.mode == "counter") {
            let task = new ToadScheduler.Task(this.id, async () => {
                let isValidTest = true
                for (let indexTrigger = 0; indexTrigger < this.triggers.length; indexTrigger++) {
                    let trigger = this.triggers[indexTrigger]
                    switch (trigger.type) {
                        case "smartobject":
                            let sqlSmartobject = new Connector("smartobject")
                            let resultSmartobject = await sqlSmartobject.getOne(trigger.source)
                            if (resultSmartobject.error) {
                                Tracing.warning(Package.name, resultSmartobject.package + " " + resultSmartobject.error)
                                await this.sqlRoutine.updateAll({
                                    status: 0
                                }, {
                                    id: this.id
                                })
                                this.close()
                                return
                            }
                            let smartobject = resultSmartobject.data
                            let settingsTriggerSmartobject = {}
                            trigger.arguments.map(argument => {
                                settingsTriggerSmartobject[argument.reference] = argument.value
                            })
                            let executeTriggerSmartobjectResult = await this.core.controller.smartobject.executeAction(
                                smartobject.id,
                                trigger.action,
                                -1,
                                settingsTriggerSmartobject,
                                true
                            )
                            if (executeTriggerSmartobjectResult.error) {
                                Tracing.warning(Package.name, executeTriggerSmartobjectResult.package + " " + executeTriggerSmartobjectResult.error)
                                this.close()
                                return
                            }
                            if (trigger.result != null) {
                                let result = executeTriggerSmartobjectResult.data
                                //Tracing.verbose(Package.name, "Check condition is " + _.get(result, trigger.result) + " " + trigger.statement + " " + trigger.expected)
                                let isCondition = this.test(_.get(result, trigger.result), trigger.statement, trigger.expected)
                                if (isCondition == false) {
                                    isValidTest = false
                                }
                            }
                            break
                        case "module":
                            let settingsEffectModule = {}
                            effect.arguments.map(argument => {
                                settingsEffectModule[argument.reference] = argument.value
                            })
                            let executeEffectModuleResult = await this.core.manager.module.executeAction(effect.source, effect.action, settingsEffectModule)
                            if (executeEffectModuleResult.error) {
                                Tracing.warning(Package.name, executeEffectModuleResult.package + " " + executeEffectModuleResult.error)
                                this.close()
                                return
                            }
                            if (trigger.result != null) {
                                let result = executeEffectModuleResult.data
                                //Tracing.verbose(Package.name, "Check condition is " + _.get(result, trigger.result) + " " + trigger.statement + " " + trigger.expected)
                                let isCondition = this.test(_.get(result, trigger.result), trigger.statement, trigger.expected)
                                if (isCondition == false) {
                                    isValidTest = false
                                }
                            }
                            break
                        case "process":
                            let sqlProcess = new Connector("process")
                            let resultProcess = await sqlProcess.getOne(trigger.source)
                            if (resultProcess.error) {
                                Tracing.warning(Package.name, resultProcess.package + " " + resultProcess.error)
                                await this.sqlRoutine.updateAll({ status: 0 }, { id: this.id })
                                this.close()
                                return
                            }
                            let settingsTriggerProcess = {}
                            trigger.arguments.map(argument => {
                                settingsTriggerProcess[argument.reference] = argument.value
                            })
                            let executeTriggerProcessResult = await this.core.controller.process.executeAction(trigger.source, -1, settingsTriggerProcess, true)
                            if (executeTriggerProcessResult.error) {
                                Tracing.warning(Package.name, executeTriggerProcessResult.package + " " + executeTriggerProcessResult.error)
                                this.close()
                                return
                            }
                            if (trigger.result != null) {
                                let result = executeTriggerProcessResult.data
                                //Tracing.verbose(Package.name, "Check condition is " + _.get(result, trigger.result) + " " + trigger.statement + " " + trigger.expected)
                                let isCondition = this.test(_.get(result, trigger.result), trigger.statement, trigger.expected)
                                if (isCondition == false) {
                                    isValidTest = false
                                }
                            }
                            break
                        default:
                            Tracing.warning(Package.name, "Type not found")
                            this.close()
                            break
                    }
                }
                if (isValidTest) {
                    Tracing.verbose(Package.name, "Routine n°" + this.id + " executed")
                    for (let indexEffect = 0; indexEffect < this.effects.length; indexEffect++) {
                        let effect = this.effects[indexEffect]
                        switch (effect.type) {
                            case "smartobject":
                                let sqlSmartobject = new Connector("smartobject")
                                let resultSmartobject = await sqlSmartobject.getOne(effect.source)
                                if (resultSmartobject.error) {
                                    Tracing.warning(Package.name, resultSmartobject.package + " " + resultSmartobject.message)
                                    this.close()
                                    return
                                }
                                let smartobject = resultSmartobject.data
                                let settingsEffectSmartobject = {}
                                effect.arguments.map(argument => {
                                    settingsEffectSmartobject[argument.reference] = argument.value
                                })
                                let executeEffectSmartobjectResult = await this.core.controller.smartobject.executeAction(
                                    smartobject.id,
                                    effect.action,
                                    -1,
                                    settingsEffectSmartobject,
                                    true
                                )
                                if (executeEffectSmartobjectResult.error) {
                                    Tracing.warning(Package.name, executeEffectSmartobjectResult.package + " " + executeEffectSmartobjectResult.message)
                                    this.close()
                                    return
                                }
                                break
                            case "module":
                                let settingsEffectModule = {}
                                effect.arguments.map(argument => {
                                    settingsEffectModule[argument.reference] = argument.value
                                })
                                let executeEffectModuleResult = await this.core.manager.module.executeAction(effect.source, effect.action, settingsEffectModule)
                                if (executeEffectModuleResult.error) {
                                    Tracing.warning(Package.name, executeEffectModuleResult.package + " " + executeEffectModuleResult.message)
                                    this.close()
                                    return
                                }
                                break
                            case "process":
                                let sqlProcess = new Connector("process")
                                let resultProcess = await sqlProcess.getOne(effect.source)
                                if (resultProcess.error) {
                                    Tracing.warning(Package.name, resultProcess.package + " " + resultProcess.message)
                                    await this.sqlRoutine.updateAll({
                                        status: 0
                                    }, {
                                        id: this.id
                                    })
                                    this.close()
                                    return
                                }
                                let settingsEffectProcess = {}
                                effect.arguments.map(argument => {
                                    settingsEffectProcess[argument.reference] = argument.value
                                })
                                let executeEffectProcessResult = await this.core.controller.process.executeAction(effect.source, -1, settingsEffectProcess, true)
                                if (executeEffectProcessResult.error) {
                                    Tracing.warning(Package.name, executeEffectProcessResult.package + " " + executeEffectProcessResult.error)
                                    this.close()
                                    return
                                }
                                break
                            default:
                                Tracing.warning(Package.name, "Type not found")
                                this.close()
                                break
                        }
                    }
                }
            })
            this.scheduler.addSimpleIntervalJob(
                new ToadScheduler.SimpleIntervalJob({ seconds: parseInt(this.watch) }, task)
            )
        } else if (this.mode == "week") {
            this.job = Schedule.scheduleJob(this.watch,async () => {
                Tracing.verbose(Package.name, "Routine n° " + this.id + " trigger")
                let isValidTest = true
                for (let indexTrigger = 0; indexTrigger < this.triggers.length; indexTrigger++) {
                    let trigger = this.triggers[indexTrigger]
                    switch (trigger.type) {
                        case "smartobject":
                            let sqlSmartobject = new Connector("smartobject")
                            let resultSmartobject = await sqlSmartobject.getOne(trigger.source)
                            if (resultSmartobject.error) {
                                Tracing.warning(Package.name, resultSmartobject.package + " " + resultSmartobject.error)
                                await this.sqlRoutine.updateAll({
                                    status: 0
                                }, {
                                    id: this.id
                                })
                                this.close()
                                return
                            }
                            let smartobject = resultSmartobject.data
                            let settingsTriggerSmartobject = {}
                            trigger.arguments.map(argument => {
                                settingsTriggerSmartobject[argument.reference] = argument.value
                            })
                            let executeTriggerSmartobjectResult = await this.core.controller.smartobject.executeAction(
                                smartobject.id,
                                trigger.action,
                                -1,
                                settingsTriggerSmartobject,
                                true
                            )
                            if (executeTriggerSmartobjectResult.error) {
                                Tracing.warning(Package.name, executeTriggerSmartobjectResult.package + " " + executeTriggerSmartobjectResult.error)
                                this.close()
                                return
                            }
                            if (trigger.result != null) {
                                let result = executeTriggerSmartobjectResult.data
                                let isCondition = this.test(_.get(result, trigger.result), trigger.statement, trigger.expected)
                                if (isCondition == false) {
                                    isValidTest = false
                                }
                            }
                            break
                        case "module":
                            let settingsEffectModule = {}
                            effect.arguments.map(argument => {
                                settingsEffectModule[argument.reference] = argument.value
                            })
                            let executeEffectModuleResult = await this.core.manager.module.executeAction(effect.source, effect.action, settingsEffectModule)
                            if (executeEffectModuleResult.error) {
                                Tracing.warning(Package.name, executeEffectModuleResult.package + " " + executeEffectModuleResult.error)
                                this.close()
                                return
                            }
                            if (trigger.result != null) {
                                let result = executeEffectModuleResult.data
                                let isCondition = this.test(_.get(result, trigger.result), trigger.statement, trigger.expected)
                                if (isCondition == false) {
                                    isValidTest = false
                                }
                            }
                            break
                        case "process":
                            let sqlProcess = new Connector("process")
                            let resultProcess = await sqlProcess.getOne(trigger.source)
                            if (resultProcess.error) {
                                Tracing.warning(Package.name, resultProcess.package + " " + resultProcess.error)
                                await this.sqlRoutine.updateAll({ status: 0 }, { id: this.id })
                                this.close()
                                return
                            }
                            let settingsTriggerProcess = {}
                            trigger.arguments.map(argument => {
                                settingsTriggerProcess[argument.reference] = argument.value
                            })
                            let executeTriggerProcessResult = await this.core.controller.process.executeAction(trigger.source, -1, settingsTriggerProcess, true)
                            if (executeTriggerProcessResult.error) {
                                Tracing.warning(Package.name, executeTriggerProcessResult.package + " " + executeTriggerProcessResult.error)
                                this.close()
                                return
                            }
                            if (trigger.result != null) {
                                let result = executeTriggerProcessResult.data
                                let isCondition = this.test(_.get(result, trigger.result), trigger.statement, trigger.expected)
                                if (isCondition == false) {
                                    isValidTest = false
                                }
                            }
                            break
                        default:
                            Tracing.warning(Package.name, "Type not found")
                            this.close()
                            break
                    }
                }
                if (isValidTest) {
                    for (let indexEffect = 0; indexEffect < this.effects.length; indexEffect++) {
                        let effect = this.effects[indexEffect]
                        switch (effect.type) {
                            case "smartobject":
                                let sqlSmartobject = new Connector("smartobject")
                                let resultSmartobject = await sqlSmartobject.getOne(effect.source)
                                if (resultSmartobject.error) {
                                    Tracing.warning(Package.name, resultSmartobject.package + " " + resultSmartobject.error)
                                    this.close()
                                    return
                                }
                                let smartobject = resultSmartobject.data
                                let settingsEffectSmartobject = {}
                                effect.arguments.map(argument => {
                                    settingsEffectSmartobject[argument.reference] = argument.value
                                })
                                let executeEffectSmartobjectResult = await this.core.controller.smartobject.executeAction(
                                    smartobject.id,
                                    effect.action,
                                    -1,
                                    settingsEffectSmartobject,
                                    true
                                )
                                if (executeEffectSmartobjectResult.error) {
                                    Tracing.warning(Package.name, executeEffectSmartobjectResult.package + " " + executeEffectSmartobjectResult.error)
                                    this.close()
                                    return
                                }
                                break
                            case "module":
                                let settingsEffectModule = {}
                                effect.arguments.map(argument => {
                                    settingsEffectModule[argument.reference] = argument.value
                                })
                                let executeEffectModuleResult = await this.core.manager.module.executeAction(effect.source, effect.action, settingsEffectModule)
                                if (executeEffectModuleResult.error) {
                                    Tracing.warning(Package.name, executeEffectModuleResult.package + " " + executeEffectModuleResult.error)
                                    this.close()
                                    return
                                }
                                break
                            case "process":
                                let sqlProcess = new Connector("process")
                                let resultProcess = await sqlProcess.getOne(effect.source)
                                if (resultProcess.error) {
                                    Tracing.warning(Package.name, resultProcess.package + " " + resultProcess.error)
                                    await this.sqlRoutine.updateAll({
                                        status: 0
                                    }, {
                                        id: this.id
                                    })
                                    this.close()
                                    return
                                }
                                let settingsEffectProcess = {}
                                effect.arguments.map(argument => {
                                    settingsEffectProcess[argument.reference] = argument.value
                                })
                                let executeEffectProcessResult = await this.core.controller.process.executeAction(effect.source, -1, settingsEffectProcess, true)
                                if (executeEffectProcessResult.error) {
                                    Tracing.warning(Package.name, executeEffectProcessResult.package + " " + executeEffectProcessResult.error)
                                    this.close()
                                    return
                                }
                                break
                            default:
                                Tracing.warning(Package.name, "Type not found")
                                this.close()
                                break
                        }
                    }
                }
            })
        }


    }

    test(current, type, excepted) {
        if (current == undefined || current == null) {
            current = ""
        } else if (typeof current == 'number') {
            excepted = parseInt(excepted)
        } else {
            current = current.toString()
        }
        switch (type) {
            case "equal":
                return current == excepted
            case "bigger":
                return current > excepted
            case "smaller":
                return current < excepted
            case "different":
                return current != excepted
            default:
                return false;
        }
    }

    async close() {
        await this.sqlRoutine.updateAll({
            status: 0
        }, {
            id: this.id
        })
        this.job.cancel()
        this.scheduler.stop()
    }

}

export default Routine