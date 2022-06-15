import Package from '../package'
import Tracing from '../utils/Tracing'
import Result from '../utils/Result'
import * as ToadScheduler from 'toad-scheduler'

import Manager from './Manager'

class Rapport extends Manager {

    constructor(core) {
        super()
        this.core = core
        this.instances = new Map()
        this.scheduler = new ToadScheduler.ToadScheduler()
        Tracing.verbose(Package.name, "Rapport manager : start")
    }


    async before() {
        let getAllRapports = await this.core.controller.rapport.getAll()
        if (getAllRapports.error) {
            return getAllRapports
        }
        getAllRapports.data.forEach(rapport => {
            if (this.instances.has(rapport.id) == false) {
                Tracing.verbose(Package.name, "Rapport manager : instanciate rapport n°" + rapport.id)

                let task = new ToadScheduler.Task(rapport.id.toString(), async () => {
                    this.executeAction(rapport)
                })
                this.executeAction(rapport)

                this.scheduler.addSimpleIntervalJob(
                    new ToadScheduler.SimpleIntervalJob({ seconds: rapport.interval }, task, "intendant_rapport_" + rapport.id)
                )
                this.instances.set(rapport.id, rapport)
            }
        })
    }

    async delete(idRapport) {
        idRapport = parseInt(idRapport)
        if (this.instances.has(idRapport)) {
            Tracing.verbose(Package.name, "Rapport manager : delete instance rapport n°" + idRapport)
            this.scheduler.removeById("intendant_rapport_" + idRapport)
            this.instances.delete(idRapport)
            return new Result(Package.name, false, "")
        } else {
            return new Result(Package.name, true, "Rapport instance not found")
        }
    }

    async executeAction(rapport) {
        Tracing.verbose(Package.name, "Rapport manager : execute rapport n°" + rapport.id)
        let getOneRapport = await this.core.controller.rapport.getOne(rapport.id)
        if (getOneRapport.error) {
            return getOneRapport
        }
        let currentRapport = getOneRapport.data
        let packageNameResult = await this.core.controller.rapport.getPackageName(currentRapport.type, currentRapport.object)
        if (packageNameResult.error) {
            return packageNameResult
        }
        let settings = {}
        currentRapport.settings.forEach(setting => {
            switch (setting.type) {
                case "string":
                    settings[setting.reference] = setting.value
                    break
                case "integer":
                    settings[setting.reference] = parseInt(setting.value)
                    break
                case "boolean":
                    settings[setting.reference] = setting.value == "true" ? true : false
                    break
            }
        })
        let dataSourceResult = await this.core.controller.widget.getDataSourceValue(currentRapport.object, currentRapport.reference)
        if (dataSourceResult.error) {
            return dataSourceResult
        }
        let resultInsertData = await this.core.controller.rapport.insertData(currentRapport.id, dataSourceResult.data.value)
        if (resultInsertData.error) {
            return resultInsertData
        }
    }

}

export default Rapport