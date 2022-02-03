import Controller from './Controller';
import Result from '../utils/Result'

declare class Process extends Controller {

    public getOne(idProcess: Number): Promise<Result>
    public getAll(): Promise<Result>
    
    public insert(pProcess: Object): Promise<Result>
    public insertProcessProfile(idProcess: Number, idProfile: Number): Promise<Result>

    public delete(idProcess: Number): Promise<Result>
    public deleteProcessProfile(idProcess: Number, idProfile: Number): Promise<Result>

    public executeAction(idProcess: Number, profile: Object, inputs: Object, force: Boolean): Promise<Result>
    
    public isAllow(process: Object, profile: Object, force: Boolean): Boolean
}

export default Process



