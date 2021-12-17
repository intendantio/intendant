import Controller from './Controller';
import Result from '../utils/Result'

declare class Process extends Controller {

    public getOne(idProcess: Number): Promise<Result>
    public getAll(): Promise<Result>
    
    public insert(reference: String, name: String, nameEnable: String, nameDisable: String, description: String, espace: Number, icon: String, mode: String, sources: Array<Object>, inputs: Array<Object>): Promise<Result>
    public insertAction(idProcess: Number, source: Object, action: Object, enable: Boolean, pArguments: Array<Object>): Promise<Result>
    public insertInput(idProcess: Number, reference: String, name: String, type: String, enable: Boolean): Promise<Result>
    public insertProcessProfile(idProcess: Number, idProfile: Number): Promise<Result>

    public delete(idProcess: Number): Promise<Result>
    public deleteAction(idProcess: Number, idAction: Number): Promise<Result>
    public deleteInput(idProcess: Number, idInput: Number): Promise<Result>
    public deleteProcessProfile(idProcess: Number, idProfile: Number): Promise<Result>

    public executeAction(idProcess: Number, profile: Object, inputs: Object, force: Boolean): Promise<Result>
    
    public isAllow(process: Object, profile: Object, force: Boolean): Boolean
}

export default Process



