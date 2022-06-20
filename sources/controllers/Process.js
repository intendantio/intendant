import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from "../utils/StackTrace"
import _ from 'lodash'
import md5 from "md5"

class Process extends Controller {

    async getAll(withData) {
        try {
            let resultSmartobjects = await this.smartobjectController.getAll()
            if(resultSmartobjects.error) {
                return resultSmartobjects
            }
            return this.getProcesses(resultSmartobjects.data,withData)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when execute process")
            return new Result(Package.name, true, "Error occurred when execute process")
        }
    }
    
    async getAllByRoom(idRoom, withData) {
        try {
            let resultSmartobjects = await this.smartobjectController.getAllByRoom(idRoom)
            if(resultSmartobjects.error) {
                return resultSmartobjects
            }
            return this.getProcesses(resultSmartobjects.data,withData)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when execute process")
            return new Result(Package.name, true, "Error occurred when execute process")
        }
    }

    async getOne(hash) {
        try {
            let resultProcessesWithoutData = await this.getAll(false)
            if(resultProcessesWithoutData.error) {
                return resultProcessesWithoutData
            }
            let processesResultWithoutData = _.find(resultProcessesWithoutData.data, { hash: hash })
            
            if(processesResultWithoutData) {
                let processes = await this.getProcesses(processesResultWithoutData.smartobjects,true)
                if(processes.error) {
                    return processes
                }
                let processesResult = _.find(processes.data, { hash: hash })
                if(processesResult) {
                    return new Result(Package.name, false, "", processesResult)
                } else {
                    return new Result(Package.name, true, "Missing process")
                }
            } else {
                return new Result(Package.name, true, "Missing process")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when execute process")
            return new Result(Package.name, true, "Error occurred when execute process")
        }
    }

    async getProcesses(smartobjects,withData = true) {
        let positions = {}
        smartobjects.forEach(smartobject => {
            if (smartobject.position && smartobject.processes) {
                let identifier = md5(smartobject.position.id + "-" + smartobject.room.id + "-" + smartobject.module + "-" + smartobject.processes.length)
                if (Array.isArray(positions[identifier]) == false) {
                    positions[identifier] = []
                }
                positions[identifier].push(smartobject)
            }
        })
        let processes = []
        for (let positionKey in positions) {
            let position = positions[positionKey]
            if(position.length > 0) {
                let currentProcesses = position[0].processes
                let name = position[0].position.name
                let room = position[0].room
                let actions = position[0].actions
                for (let index = 0; index < currentProcesses.length; index++) {
                    let process = currentProcesses[index]
                    let resultProcess = await this.getProcess(name,actions,position,process,positionKey, room, withData)
                    if(resultProcess.error) {
                        return resultProcess
                    }
                    processes.push(resultProcess.data)
                }
            }
        }
        return new Result(Package.name, false, "", processes)
    }

   
    async getProcess(name,actions,smartobjects,process,positionKey, room, withData = true) {
        let values = []
        let lastValue = null
        if(withData) {
            for (let indexSmartobject = 0; indexSmartobject < smartobjects.length; indexSmartobject++) {
                let smartobject = smartobjects[indexSmartobject]
    
                let resultDataSourceValue = await this.widgetController.getDataSourceValue(smartobject.id, process.dataSource)
                if (resultDataSourceValue.error) {
                    return resultDataSourceValue
                }
                lastValue = resultDataSourceValue.data.value
                values.push(resultDataSourceValue.data.value)
    
            }
        }
        let currentAction = _.size(_.countBy(values)) == 1 ? process.actions[lastValue] : process.actions.default
        
        let action = _.find(actions, { id: currentAction })
        let resultProcess = {
            id: process.id,
            smartobjects: smartobjects,
            actions: process.actions,
            smartobjectActions: actions,
            dataSource: process.dataSource,
            action: currentAction,
            isDefault: currentAction != process.actions.default,
            position: name,
            name: action.name + " on " + name,
            room: room,
            settings: action.settings,
            hash:  md5(positionKey + "-" + process.id)
        }
        return new Result(Package.name,false,"",resultProcess)
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



}

export default Process