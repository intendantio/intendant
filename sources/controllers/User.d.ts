import Controller from './Controller';
import Result from '../utils/Result'

declare class User extends Controller {

    public getOne(idUser: Number): Promise<Result>
    public getAll(): Promise<Result>
    public delete(idUser: String): Promise<Result>
    public insert(login: String, password: String, profile: Number): Promise<Result>
    public insertAdmin(password: String): Promise<Result>
    public update(idUser: String, login: String, profile: Number): Promise<Result>
    public updatePassword(idUser: String, password: String): Promise<Result>
    public getStarted(): Promise<Result>

}

export default User



