import Controller from './Controller';
import Result from '../utils/Result'

declare class Storage extends Controller {

    public getItem(id: String): Promise<Result>
    public setItem(id: String, value: Object): Promise<Result>
    public removeItem(id: String): Promise<Result>
    public clear(): Promise<Result>

}

export default Storage



