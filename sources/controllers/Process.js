import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from "../utils/StackTrace"
import _ from 'lodash'
import md5 from "md5"

class Process extends Controller {

    
    async getOne(hash) {
        try {
            let processes = await this.getAllWithoutData()
            if(processes.error) {
                return processes
            }
            let currentProcess = false
            processes.data.forEach(process => {
                if(process.hash == hash) {
                    currentProcess = process
                }
            })
            if(currentProcess) {

                let values = []
                let lastValue = null

                for (let indexSmartobject = 0; indexSmartobject < currentProcess.smartobjects.length; indexSmartobject++) {
                    let smartobject = currentProcess.smartobjects[indexSmartobject]

                    let resultDataSourceValue = await this.widgetController.getDataSourceValue(smartobject, currentProcess.dataSource)
                    if (resultDataSourceValue.error) {
                        return resultDataSourceValue
                    }
                    lastValue = resultDataSourceValue.data.value
                    values.push(resultDataSourceValue.data.value)

                }      
                let currentAction = _.size(_.countBy(values)) == 1 ? currentProcess.actions[lastValue] : currentProcess.actions.default
                let action = _.find(currentProcess.smartobjectActions, { id: currentAction })

                currentProcess.action = currentAction
                currentProcess.settings = action.settings
                currentProcess.isDefault = currentAction != currentProcess.actions.default
                currentProcess.name =  action.name + " on " + currentProcess.position

                return new Result(Package.name, false, "",currentProcess)
            } else {
                return new Result(Package.name, true, "Missing process")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one process")
            return new Result(Package.name, true, "Error occurred when get one process")
        }
    }

    async executeAction(settings, smartobjects, action) {
        try {
            for (let index = 0; index < smartobjects.length; index++) {
                let smartobject = smartobjects[index]
                await this.smartobjectManager.instances.get(smartobject).action(action, settings)
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when execute process")
            return new Result(Package.name, true, "Error occurred when execute process")
        }
    }

    async getAllWithoutData() {
        let resultSmartobject = await this.smartobjectController.getAll()
        if (resultSmartobject.error) {
            return resultSmartobject
        }
        let positions = {}

        let smartobjects = resultSmartobject.data
        smartobjects.forEach(smartobject => {
            if (smartobject.position && smartobject.processes) {
                let identifier = md5(smartobject.position.id + "-" + smartobject.room.id + "-" + smartobject.module + "-" + smartobject.processes.length)
                if (Array.isArray(positions[identifier]) == false) {
                    positions[identifier] = []
                }
                positions[identifier].push(smartobject)
            }
        })

        let availableProcesses = []

        for (let positionKey in positions) {
            let position = positions[positionKey]
            let processes = position[0].processes
            let name = position[0].position.name
            let room = position[0].room

            let actions = position[0].actions

            let idSmartobjects = position.map(smartobject => {
                return smartobject.id
            })

            for (let index = 0; index < processes.length; index++) {
                let process = processes[index]

                let currentAction =  process.actions.default
                let action = _.find(actions, { id: currentAction })

                availableProcesses.push({
                    id: process.id,
                    actions: process.actions,
                    smartobjectActions: actions,
                    dataSource: process.dataSource,
                    action: currentAction,
                    isDefault: currentAction != process.actions.default,
                    smartobjects: idSmartobjects,
                    position: name,
                    name: action.name + " on " + name,
                    settings: action.settings,
                    room: room,
                    hash:  md5(positionKey + "-" + process.id)
                })
            }
        }

        return new Result(Package.name, false, "", availableProcesses)

    }

    async getAll() {
        let resultSmartobject = await this.smartobjectController.getAll()
        if (resultSmartobject.error) {
            return resultSmartobject
        }
        let positions = {}

        let smartobjects = resultSmartobject.data
        smartobjects.forEach(smartobject => {
            if (smartobject.position && smartobject.processes) {
                let identifier = md5(smartobject.position.id + "-" + smartobject.room.id + "-" + smartobject.module + "-" + smartobject.processes.length)
                if (Array.isArray(positions[identifier]) == false) {
                    positions[identifier] = []
                }
                positions[identifier].push(smartobject)
            }
        })

        let availableProcesses = []

        for (let positionKey in positions) {
            let position = positions[positionKey]
            let processes = position[0].processes
            let name = position[0].position.name
            let room = position[0].room

            let actions = position[0].actions

            let idSmartobjects = position.map(smartobject => {
                return smartobject.id
            })

            for (let index = 0; index < processes.length; index++) {
                let process = processes[index]

                let values = []
                let lastValue = null

                for (let indexSmartobject = 0; indexSmartobject < position.length; indexSmartobject++) {
                    let smartobject = position[indexSmartobject]

                    let resultDataSourceValue = await this.widgetController.getDataSourceValue(smartobject.id, process.dataSource)
                    if (resultDataSourceValue.error) {
                        return resultDataSourceValue
                    }
                    lastValue = resultDataSourceValue.data.value
                    values.push(resultDataSourceValue.data.value)

                }
                let currentAction = _.size(_.countBy(values)) == 1 ? process.actions[lastValue] : process.actions.default
                let action = _.find(actions, { id: currentAction })

                availableProcesses.push({
                    id: process.id,
                    actions: process.actions,
                    smartobjectActions: actions,
                    dataSource: process.dataSource,
                    action: currentAction,
                    isDefault: currentAction != process.actions.default,
                    smartobjects: idSmartobjects,
                    position: name,
                    name: action.name + " on " + name,
                    settings: action.settings,
                    room: room,
                    hash:  md5(positionKey + "-" + process.id)
                })
            }
        }

        return new Result(Package.name, false, "", availableProcesses)


    }

}

export default Process