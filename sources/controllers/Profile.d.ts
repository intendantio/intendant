import Controller from './Controller';
import Result from '../utils/Result'

declare class Profile extends Controller {

    public getOne(idProfile: Number): Promise<Result>
    public getAll(): Promise<Result>

}

export default Profile



