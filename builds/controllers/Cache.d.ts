import Controller from './Controller';
import Result from '../utils/Result'

declare class Cache extends Controller {

    public get(get: Object): Promise<Result>
    public insert(): Promise<Result>
    public check(): Promise<Result>

}

export default Cache



