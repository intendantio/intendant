import Controller from './Controller';
import Result from '../utils/Result'

declare class Routine extends Controller {

    public duplicate(idRoutine: Number): Promise<Result>

    public getOne(idRoutine: Number): Promise<Result>
    public getAll(): Promise<Result>
    public getAllEffectByRoutine(idRoutine: Number): Promise<Result>
    public getAllTriggerByRoutine(idRoutine: Number): Promise<Result>
    public insert(name: String, icon: String, watch: Number, triggers: Array<Object>, effects: Array<Object>, mode: String): Promise<Result>
    public update(idRoutine: Number, name: String, icon: String, watch: Number, triggers: Array<Object>, effects: Array<Object>, mode: String): Promise<Result>
    public delete(idRoutine: Number): Promise<Result>
    public updateStatus(idRoutine: Number, status: Number): Promise<Result>
}

export default Routine



