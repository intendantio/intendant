import Instance from '../instances/Routine'
import Package from '../package'
import Connector from '../connector'
import Tracing from '../utils/Tracing'
import Result from '../utils/Result'
import StackTrace from '../utils/StackTrace'
import Manager from './Manager'

class Routine extends Manager {

    constructor(core) {
        super()
        this.core = core
        this._instances = new Map()
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
                let exist = this._instances.has(routine.id)
                if (routine.status === 0 && exist) {
                    Tracing.verbose(Package.name, "Routine n°" + routine.id + " stop")
                    this._instances.get(routine.id).close()
                    this._instances.delete(routine.id)
                } else if (routine.status === 1 && exist === false) {
                    Tracing.verbose(Package.name, "Routine n°" + routine.id + " start")
                    let result = await this.core.controller.routine.getOne(routine.id)
                    routine = result.data
                    this._instances.set(routine.id, new Instance(routine, this.core))
                }
            })
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get token")
            return new Result(Package.name, true, "Error occurred when routine initialisation")
        }
    }

}

export default Routine