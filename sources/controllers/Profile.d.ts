import Controller from './Controller';
import Result from '../utils/Result'

declare class Profile extends Controller {

    constructor(smartobjectManager: Object, moduleManager: Object)

    public getOne(idProfile: Number): Promise<Result>
    public getAll(): Promise<Result>

}

export default Profile



