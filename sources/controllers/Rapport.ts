import Controller from "./Controller"
import StackTrace from "../utils/StackTrace"
import Tracing from "../utils/Tracing"
import Result from "../utils/Result"
import Package from '../package.json'
import Smartobject from "./Smartobject"
import Module from "./Module"
import Widget from "./Widget"
import RapportManager from '../managers/Rapports'

class Rapport extends Controller {

    private smartobjectController: Smartobject
    private moduleController: Module
    private widgetController: Widget
    private rapportManager: RapportManager

    async getPackageName(type, object): Promise<Result> {
        let packageName = ""
        if (type == "smartobject") {
            let resultSmartobject = await this.smartobjectController.getOne(object)
            if (resultSmartobject.error) {
                return resultSmartobject
            }
            let smartobject = resultSmartobject.data
            if (smartobject.configuration != null) {
                packageName = smartobject.configuration.name
            } else {
                return new Result(Package.name, true, "Missing configuration with smartobject n°" + object)
            }
        } else if (type == "module") {
            let resultModule = await this.moduleController.getBySum(object)
            if (resultModule.error) {
                return resultModule
            }
            if (resultModule.data == false) {
                return new Result(Package.name, true, "Missing configuration with module n°" + object)
            }
            packageName = resultModule.data
        } else {
            return new Result(Package.name, true, "Invalid type")
        }
        return new Result(Package.name, false, "", packageName)
    }

    async getOne(idRapport): Promise<Result> {
        try {
            let resultRapport = await this.sqlRapport.getOne(idRapport)
            if (resultRapport.error) {
                return resultRapport
            }
            if (resultRapport.data == false) {
                return new Result(Package.name, true, "Missing rapport n°" + idRapport)
            }
            let resultRapportArgument = await this.sqlRapportArgument.getAllByField({ rapport: idRapport })
            if (resultRapportArgument.error) {
                return resultRapportArgument
            }
            resultRapport.data.settings = resultRapportArgument.data
            let resultLastData = await this.sqlRapportData.execute("SELECT * FROM rapport_data WHERE rapport = " + idRapport + " ORDER BY date DESC LIMIT 1", {}, false)
            if (resultLastData.error) {
                return new Result(Package.name, true, "Error occured when select last data")
            }
            resultRapport.data.lastData = resultLastData.data.length == 0 ? false : resultLastData.data[0]
            let resultCounter = await this.sqlRapportData.execute("SELECT count(*) as total FROM rapport_data WHERE rapport = " + idRapport + " ", {}, false)
            if (resultCounter.error) {
                return new Result(Package.name, true, "Error occured when count data")
            }
            resultRapport.data.total = resultCounter.data.length == 0 ? 0 : resultCounter.data[0].total
            let resultPackage = await this.getPackageName(resultRapport.data.type, resultRapport.data.object)
            if (resultPackage.error) {
                return resultPackage
            }
            let resultConfiguration = await this.widgetController.getConfiguration(resultPackage.data)
            if (resultConfiguration.error) {
                return resultConfiguration
            }
            resultRapport.data.configuration = resultConfiguration.data
            if (resultRapport.data.type == "smartobject") {
                let resultSmartobject = await this.smartobjectController.getOne(resultRapport.data.object)
                if (resultSmartobject.error) {
                    return resultSmartobject
                }
                resultRapport.data.smartobject = resultSmartobject.data
            }
            return resultRapport
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one rapport")
            return new Result(Package.name, true, "Error occurred when get one rapport")
        }
    }

    async getAll(): Promise<Result> {
        try {
            let resultRapports = await this.sqlRapport.getAll()
            if (resultRapports.error) {
                return resultRapports
            }
            let rapports = []
            for (let indexRapport = 0; indexRapport < resultRapports.data.length; indexRapport++) {
                let rapport = resultRapports.data[indexRapport]
                let resultGetOne = await this.getOne(rapport.id)
                if (resultGetOne.error) {
                    Tracing.warning(Package.name, "Error occurred when get one rapport " + rapport.id)
                    this.delete(rapport.id)
                } else {
                    rapports.push(resultGetOne.data)
                }
            }
            return new Result(Package.name, false, "", rapports)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all rapport")
            return new Result(Package.name, true, "Error occurred when get all rapport")
        }
    }

    async insert(body): Promise<Result> {
        try {
            let result = await this.sqlRapport.insert({
                type: body.type,
                chart: body.chart,
                object: body.object.toString(),
                reference: body.reference,
                interval: body.interval
            })
            if (result.error) {
                return result
            }
            for (let indexSettings = 0; indexSettings < body.settings.length; indexSettings++) {
                let setting = body.settings[indexSettings]
                let resultInserRapportArgument = await this.sqlRapportArgument.insert({
                    reference: setting.reference,
                    value: setting.value,
                    type: setting.type,
                    rapport: result.data.insertId
                })
                if (resultInserRapportArgument.error) {
                    return resultInserRapportArgument
                }
            }
            this.rapportManager.before()
            return await this.getOne(result.data.insertId)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert rapport")
            return new Result(Package.name, true, "Error occurred when insert rapport")
        }
    }

    async delete(idRapport): Promise<Result> {
        Tracing.verbose(Package.name, "Delete rapport n°" + idRapport)
        try {
            if (this.rapportManager.instances.has(idRapport)) {
                let resultDeleteInstance = await this.rapportManager.delete(idRapport)
                if (resultDeleteInstance.error) {
                    return resultDeleteInstance
                }
            }
            let rapportArgumentRequest = await this.truncate(idRapport)
            if (rapportArgumentRequest.error) {
                return rapportArgumentRequest
            }
            let rapportDeleteRequest = await this.sqlRapport.deleteOne(idRapport)
            if (rapportDeleteRequest.error) {
                return rapportDeleteRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete rapport")
            return new Result(Package.name, true, "Error occurred when delete rapport")
        }
    }

    async truncate(idRapport): Promise<Result> {
        try {
            let rapportArgumentRequest = await this.sqlRapportData.deleteAllByField({ rapport: idRapport })
            if (rapportArgumentRequest.error) {
                return rapportArgumentRequest
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when truncate rapport")
            return new Result(Package.name, true, "Error occurred when truncate rapport")
        }
    }

    async insertData(idRapport, value): Promise<Result> {
        try {
            let resultRapport = await this.getOne(idRapport)
            if (resultRapport.error) {
                return resultRapport
            }
            let timestamp = require('moment')().valueOf()
            let pValue = ""
            if (typeof value == "string") {
                pValue = value
            } else if (typeof value == "object") {
                pValue = JSON.stringify(value)
            } else if (typeof value == "number") {
                pValue = value.toString()
            } else if (typeof value == "boolean") {
                pValue = value ? "true" : "false"
            } else {
                pValue = "unknown"
            }
            let resultRapportData = await this.sqlRapportData.insert({
                date: timestamp,
                rapport: idRapport,
                value: pValue
            })
            if (resultRapportData.error) {
                return resultRapportData
            }
            return new Result(Package.name, false, "", {})
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert data rapport")
            return new Result(Package.name, true, "Error occurred when insert data rapport")
        }
    }

    async getData(idRapport, start, end): Promise<Result> {
        try {
            let resultRapport = await this.getOne(idRapport)
            if (resultRapport.error) {
                return resultRapport
            }
            let resultRequest = await this.sqlRapportData.execute("SELECT * FROM rapport_data WHERE rapport=" + idRapport + " AND date >=" + start + " AND date <=" + end + " ORDER BY date ASC", {}, false)
            if (resultRequest.error) {
                return new Result(Package.name, true, "Error occured when select data")
            }
            resultRequest.data = resultRequest.data.map(data => {
                delete data.rapport
                delete data.id
                return data
            })
            return new Result(Package.name, false, "", resultRequest.data)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get data rapport")
            return new Result(Package.name, true, "Error occurred when get data rapport")
        }
    }

}

export default Rapport