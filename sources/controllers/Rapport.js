import Controller from "./Controller"
import StackTrace from "../utils/StackTrace"
import Tracing from "../utils/Tracing"
import Result from "../utils/Result"
import Package from '../package.json'
import Moment from 'moment'

const TYPES = [
    "lineChart",
    "pieChart"
]

class Rapport extends Controller {

    constructor(rapportManager, widgetController, smartobjectController) {
        super()
        this.rapportManager = rapportManager
        this.widgetController = widgetController
        this.smartobjectController = smartobjectController
    }

    async getOne(idRapport) {
        try {
            let resultRapport = await this.sqlRapport.getOne(idRapport)
            if(resultRapport.error) {
                return resultRapport
            }
            if(resultRapport.data == false) {
                return new Result(Package.name, true, "Missing rapport n°" + idRapport)
            }
            
            let resultRapportArgument = await this.sqlRapportArgument.getAllByField({rapport: idRapport})
            if(resultRapportArgument.error) {
                return resultRapportArgument
            }

            resultRapport.data.settings = resultRapportArgument.data
            
            let resultLastData = await this.sqlRapportData.execute("SELECT * FROM rapport_data WHERE rapport = " + idRapport + " ORDER BY date DESC LIMIT 1")
            
            if(resultLastData.error) {
                return resultLastData
            }

            resultRapport.data.lastData = resultLastData.data.length == 0 ? false : resultLastData.data[0]


            let resultCounter = await this.sqlRapportData.execute("SELECT count(*) as total FROM rapport_data WHERE rapport = " + idRapport + " ")
           
            if(resultCounter.error) {
                return resultCounter
            }

            resultRapport.data.total = resultCounter.data.length == 0 ? 0 : resultCounter.data[0].total
            
            let packageName = ""

            if(resultRapport.data.type == "smartobject") {
                let resultGetPackage = await this.widgetController.getPackageName("smartobject",resultRapport.data.object)
                if(resultGetPackage.error) {
                    return resultGetPackage
                }
                packageName = resultGetPackage.data

                let smartobjectResult = await this.smartobjectController.getOne(resultRapport.data.object)
                if(smartobjectResult.error) {
                    return smartobjectResult
                }
                resultRapport.data.smartobject = smartobjectResult.data
                
            } else {
                packageName = resultRapport.data.object
            }
            let resultConfiguration = await this.widgetController.getConfiguration(packageName)
            if(resultConfiguration.error) {
                return resultConfiguration
            }
            
            resultRapport.data.configuration = resultConfiguration.data



            return resultRapport
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one rapport")
            return new Result(Package.name, true, "Error occurred when get one rapport")
        }
    }

    async getAll() {
        try {
            let resultRapports =  await this.sqlRapport.getAll()

            if(resultRapports.error) {
                return resultRapports
            }
            
            let rapports = []

            for (let indexRapport = 0; indexRapport < resultRapports.data.length; indexRapport++) {
                let rapport = resultRapports.data[indexRapport]
                let resultGetOne = await this.getOne(rapport.id)
                if(resultGetOne.error) {
                    return resultGetOne
                }
                rapports.push(resultGetOne.data)
            }
            
            return new Result(Package.name, false, "", rapports)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all rapport")
            return new Result(Package.name, true, "Error occurred when get all rapport")
        }
    }

    async insert(type, chart, object, reference, interval, settings) {
        try {
            if (TYPES.includes(chart)) {

                /*if(interval < 120 ) {
                    Tracing.warning(Package.name, "Interval is too small, minimum 120 seconds")
                    return new Result(Package.name, false, "Interval is too small, minimum 120 seconds")
                }*/
                let result = await this.sqlRapport.insert({
                    type: type,
                    chart: chart,
                    object: object,
                    reference: reference,
                    interval: interval
                })
                if (result.error) {
                    return result
                }


                for (let indexSettings = 0; indexSettings < settings.length; indexSettings++) {
                    let setting = settings[indexSettings]
                    let resultInserRapportArgument = await this.sqlRapportArgument.insert({
                        reference: setting.reference,
                        value: setting.value,
                        type:  setting.type,
                        rapport: result.data.insertId
                    })
                    if(resultInserRapportArgument.error) {
                        return resultInserRapportArgument
                    }
                }


                this.rapportManager.initialisation(result.data.insertId)
                
                return await this.getOne(result.data.insertId)
            } else {
                Tracing.error(Package.name, "Invalid rapport type")
                return new Result(Package.name, false, "Invalid rapport type")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert rapport")
            return new Result(Package.name, true, "Error occurred when insert rapport")
        }
    }

    async delete(idRapport) {
        try {

            let resultDeleteInstance = await this.rapportManager.delete(idRapport)

            if(resultDeleteInstance.error) {
                return resultDeleteInstance
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

    async truncate(idRapport) {
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

    async insertData(idRapport, value) {
        try {
            let resultRapport = await this.getOne(idRapport)
            if (resultRapport.error) {
                return resultRapport
            }
            let timestamp = Moment().valueOf()

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

    async getData(idRapport, start, end) {
        try {
            let resultRapport = await this.getOne(idRapport)
            if (resultRapport.error) {
                return resultRapport
            }
            let resultRequest = await this.sqlRapportData.execute("SELECT * FROM rapport_data WHERE rapport=" + idRapport + " AND date >=" + start + " AND date <=" + end + " ORDER BY date ASC")
            if(resultRequest.error) {
                return resultRequest
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