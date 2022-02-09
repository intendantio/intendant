import Controller from './Controller';
import Result from '../utils/Result'

declare class Smartobject extends Controller {

    constructor(smartobjectManager: Object, userController: Controller)

    public getAll(): Promise<Result>

    public deleteArguments(idArgument: Number): Promise<Result>
    public insertArguments(idSmartobject: Number, Reference: String, value: String): Promise<Result>

    public getOne(idSmartobject: Number): Promise<Result>
    public insertSmartobjectProfile(idSmartobject: Number, idProfile: Number): Promise<Result>
    public deleteSmartobjectProfile(idSmartobject: Number, idProfile: Number): Promise<Result>
    public updateStatus(idSmartobject: Number, status: Number): Promise<Result>
    public updateLastUse(idSmartobject: Number): Promise<Result>
    public insert(pModule: String, reference: String, pArguments: Array<Object>): Promise<Result>
    public insert(pModule: String, reference: String, pArguments: Array<Object>): Promise<Result>
    public delete(idSmartobject: Number): Promise<Result>
    public isAllow(smartobject: Object, profile: Object, force: Boolean): Boolean
    public executeAction(idSmartobject: Number, idAction: Number, idProfile: Number, pArguments: Array<Object>, force: Boolean): Promise<Result>
    public getConfiguration(): Promise<Result>
}

export default Smartobject



