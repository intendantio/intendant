import Controller from './Controller';
import Result from '../utils/Result'

declare class Authentification extends Controller {

    public getAll(): Promise<Result>
    public getAllAuthorizationByProfile(idProfile: Number): Promise<Result>
    
    public checkAuthorization(request: Object): Promise<Result>
    public getToken(login: String, password: String): Promise<Result>
    public updateAuthorizationByProfile(id: Number, authorization: Number, secure: Number): Promise<Result>

}

export default Authentification



