import Controller from './Controller';
import Result from '../utils/Result'

declare class Client extends Controller {

    public insert(settings: Object): Promise<Result>
    public getAll(): Promise<Result>

}

export default Client



