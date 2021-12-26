import Controller from './Controller'
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from '../utils/StackTrace'

class Routine extends Controller {

    constructor(routineManager) {
        super()
        this.routineManager = routineManager
    }

    async duplicate(idRoutine) {
        try {
            let result = await this.getOne(idRoutine)
            let currentRoutine = result.data
            let resultInsert = await this.insert(
                currentRoutine.name + "_duplicate",
                currentRoutine.icon,
                currentRoutine.watch,
                currentRoutine.triggers,
                currentRoutine.effects,
                currentRoutine.mode
            )
            return resultInsert
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when duplicate an routine")
            return new Result(Package.name, true, "Error occurred when duplicate an routine")
        }
    }

    async getAll() {
        try {
            let arrRoutines = []
            let routinesRequest = await this.sqlRoutine.getAll()
            if (routinesRequest.error) {
                Tracing.warning(Package.name, routinesRequest.message)
                return routinesRequest
            }
            let routines = routinesRequest.data
            for (let indexRoutine = 0; indexRoutine < routines.length; indexRoutine++) {
                let routine = routines[indexRoutine]
                let resultRoutine = await this.getOne(routine.id)
                if (resultRoutine.error) {
                    return resultRoutine
                }
                arrRoutines.push(resultRoutine.data)
            }
            return new Result(Package.name, false, "", arrRoutines)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all routine")
            return new Result(Package.name, true, "Error occurred when get all routine")
        }
    }

    async getAllEffectByRoutine(idRoutine) {
        try {
            let effectsRequest = await this.sqlRoutineEffect.getAllByField({ routine: idRoutine })
            if (effectsRequest.error) {
                return effectsRequest
            }
            let effects = effectsRequest.data
            let arrEffects = []
            for (let indexEffect = 0; indexEffect < effects.length; indexEffect++) {
                let effect = effects[indexEffect]
                let argumentsRequests = await this.sqlRoutineEffectArgument.getAllByField({ routine_effect: effect.id })
                if (argumentsRequests.error) {
                    return argumentsRequests
                }
                effect.arguments = argumentsRequests.data
                arrEffects.push(effect)
            }
            return new Result(Package.name, false, "", arrEffects)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all effect by routine")
            return new Result(Package.name, true, "Error occurred when get all effect by routine")
        }
    }

    async getAllTriggerByRoutine(idRoutine) {
        try {
            let triggersRequest = await this.sqlRoutineTrigger.getAllByField({ routine: idRoutine })
            if (triggersRequest.error) {
                return triggersRequest
            }
            let triggers = triggersRequest.data
            let arrTriggers = []
            for (let indexTrigger = 0; indexTrigger < triggers.length; indexTrigger++) {
                let trigger = triggers[indexTrigger]
                let argumentsRequests = await this.sqlRoutineTriggerArgument.getAllByField({ routine_trigger: trigger.id })
                if (argumentsRequests.error) {
                    return argumentsRequests
                }
                trigger.arguments = argumentsRequests.data
                arrTriggers.push(trigger)
            }
            return new Result(Package.name, false, "", arrTriggers)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all trigger by routine")
            return new Result(Package.name, true, "Error occurred when get all trigger by routine")
        }
    }

    async getOne(idRoutine) {
        try {
            let routineRequest = await this.sqlRoutine.getOne(idRoutine)
            if (routineRequest.error) {
                return routineRequest
            }
            if (routineRequest.data == false) {
                return new Result(Package.name, true, "Routine not found")
            }
            let routine = routineRequest.data
            let effectsRequest = await this.getAllEffectByRoutine(routine.id)
            if (effectsRequest.error) {
                return effectsRequest
            }
            let effects = effectsRequest.data
            let triggersRequest = await this.getAllTriggerByRoutine(routine.id)
            if (triggersRequest.error) {
                return triggersRequest
            }
            let triggers = triggersRequest.data
            routine.triggers = triggers
            routine.effects = effects
            return new Result(Package.name, false, "", routine)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one routine")
            return new Result(Package.name, true, "Error occurred when get one routine")
        }
    }

    async insert(name, icon, watch, triggers, effects, mode) {
        try {
            if (typeof name == 'string' && typeof mode == 'string' && typeof icon == 'string' && (typeof watch == 'string' || typeof watch == 'number') && Array.isArray(triggers) && Array.isArray(effects)) {
                let resultInsert = await this.sqlRoutine.insert({
                    id: null,
                    name: name,
                    watch: watch,
                    icon: icon,
                    status: 0,
                    mode: mode
                })
                if (resultInsert.error) {
                    return resultInsert
                }
                let routineId = resultInsert.data.insertId
                for (let indexEffect = 0; indexEffect < effects.length; indexEffect++) {
                    let effect = effects[indexEffect]
                    let effectRequest = await this.sqlRoutineEffect.insert({
                        id: null,
                        routine: routineId,
                        source: effect.source,
                        action: effect.action,
                        type: effect.type
                    })
                    if (effectRequest.error) {
                        return effectRequest
                    }
                    let effectId = effectRequest.data.insertId
                    for (let indexSetting = 0; indexSetting < effect.arguments.length; indexSetting++) {
                        let setting = effect.arguments[indexSetting]
                        let effectArgumentRequest = await this.sqlRoutineEffectArgument.insert({
                            id: null,
                            routine_effect: effectId,
                            reference: setting.reference,
                            value: setting.value
                        })
                        if (effectArgumentRequest.error) {
                            return effectArgumentRequest
                        }
                    }
                }
                for (let indexTrigger = 0; indexTrigger < triggers.length; indexTrigger++) {
                    let trigger = triggers[indexTrigger]
                    let triggerRequest = await this.sqlRoutineTrigger.insert({
                        id: null,
                        routine: routineId,
                        source: trigger.source,
                        action: trigger.action,
                        type: trigger.type,
                        result: trigger.result ? trigger.result : null,
                        statement: trigger.statement ? trigger.statement : null,
                        expected: trigger.expected ? trigger.expected : null
                    })
                    if (triggerRequest.error) {
                        return triggerRequest
                    }
                    let triggerId = triggerRequest.data.insertId
                    for (let indexSetting = 0; indexSetting < trigger.arguments.length; indexSetting++) {
                        let setting = trigger.arguments[indexSetting]
                        let triggerArgumentRequest = await this.sqlRoutineTriggerArgument.insert({
                            id: null,
                            routine_trigger: triggerId,
                            reference: setting.reference,
                            value: setting.value
                        })
                        if (triggerArgumentRequest.error) {
                            return triggerArgumentRequest
                        }
                    }
                }
            } else {
                return new Result(Package.name, true, "Missing parameters")
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert routine")
            return new Result(Package.name, true, "Error occurred when insert routine")
        }
    }

    async update(idRoutine, name, icon, watch, triggers, effects, mode) {
        try {
            let resultProcess = await this.delete(idRoutine)
            if (resultProcess.error) {
                return resultProcess
            }
            let resultInsert = this.insert(name, icon, watch, triggers, effects, mode)
            if (resultInsert.error) {
                return resultInsert
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update routine")
            return new Result(Package.name, true, "Error occurred when update routine")
        }
    }

    async delete(idRoutine) {
        try {
            let resultEffects = await this.sqlRoutineEffect.getAllByField({ routine: idRoutine })
            if (resultEffects.error) {
                return resultEffects
            }
            for (let effectIndex = 0; effectIndex < resultEffects.data.length; effectIndex++) {
                let effect = resultEffects.data[effectIndex]
                let resultEffectsArgument = await this.sqlRoutineEffectArgument.deleteAllByField({ routine_effect: effect.id })
                if (resultEffectsArgument.error) {
                    return resultEffectsArgument
                }
            }
            let resultTriggers = await this.sqlRoutineTrigger.getAllByField({ routine: idRoutine })
            if (resultTriggers.error) {
                return resultTriggers
            }
            for (let triggerIndex = 0; triggerIndex < resultTriggers.data.length; triggerIndex++) {
                let trigger = resultTriggers.data[triggerIndex]
                let resultTriggersArgument = await this.sqlRoutineTriggerArgument.deleteAllByField({ routine_trigger: trigger.id })
                if (resultTriggersArgument.error) {
                    return resultTriggersArgument
                }
            }
            await this.sqlRoutineEffect.deleteAllByField({ routine: idRoutine })
            await this.sqlRoutineTrigger.deleteAllByField({ routine: idRoutine })
            await this.sqlRoutine.deleteOne(idRoutine)
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete routine")
            return new Result(Package.name, true, "Error occurred when delete routine")
        }
    }

    async updateStatus(idRoutine, status) {
        try {
            let routineRequest = this.sqlRoutine.updateAll({ status: status }, { id: idRoutine })
            if (routineRequest.error) {
                return routineRequest
            } else {
                this.routineManager.initialisation()
                return new Result(Package.name, false, "")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update status routine")
            return new Result(Package.name, true, "Error occurred when update status routine")
        }
    }

}

export default Routine