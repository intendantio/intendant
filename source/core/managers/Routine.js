import RoutineInstance from '../instances/Routine'
import Package from '../package'

class RoutineCore {

    constructor(core) {
        this.core = core
        this.logger = core.logger
        this.configuration = this.core.configuration
        this.routines = new Map()
        this.logger.verbose(Package.name, "Start Routine Manager")
        this.initialisation()
        setInterval(async () => {
            await this.initialisation()
        }, 5000)
    }

    async initialisation() {
        let sqlRoutine = new this.core.connector(this.configuration, this.core, "routine")
        let routinesRequest = await sqlRoutine.getAll()
        if (routinesRequest.error) {
            this.logger.warning(Package.name, routinesRequest.message)
            return
        }
        let routines = routinesRequest.data
        routines.forEach(async routine => {
            let exist = this.routines.has(routine.id)
            if (routine.status === 0 && exist) {
                this.logger.verbose(Package.name, "Disable routine n°" + routine.id)
                this.routines.get(routine.id).close()
                this.routines.delete(routine.id)
            } else if (routine.status === 1 && exist === false) {
                this.logger.verbose(Package.name, "Enable routine n°" + routine.id)
                let result = await this.core.controller.routine.getOne(routine.id)
                routine = result.data
                this.routines.set(routine.id, new RoutineInstance(routine, this.core))
            }
        })
    }
}

export default RoutineCore