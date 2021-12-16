import RoutineInstance from '../instances/Routine'
import Package from '../package'
import Connector from '../connector'
import Tracing from '../utils/Tracing'

class RoutineCore {

    constructor(core) {
        this.core = core
        this.configuration = this.core.configuration
        this.routines = new Map()
        Tracing.verbose(Package.name, "Routine manager : start")
        this.initialisation()
    }

    async initialisation() {
        try {
            let sqlRoutine = new Connector("routine")
            let routinesRequest = await sqlRoutine.getAll()
            if (routinesRequest.error) {
                Tracing.warning(Package.name, routinesRequest.message)
                return
            }
            let routines = routinesRequest.data
            routines.forEach(async routine => {
                let exist = this.routines.has(routine.id)
                if (routine.status === 0 && exist) {
                    Tracing.verbose(Package.name, "Routine manager : disable routine n°" + routine.id)
                    this.routines.get(routine.id).close()
                    this.routines.delete(routine.id)
                } else if (routine.status === 1 && exist === false) {
                    Tracing.verbose(Package.name, "Routine manager : enable routine n°" + routine.id)
                    let result = await this.core.controller.routine.getOne(routine.id)
                    routine = result.data
                    this.routines.set(routine.id, new RoutineInstance(routine, this.core))
                }
            })
        } catch (error) {
            Tracing.error("Routine manager : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

}

export default RoutineCore