import Result from '../utils/Result'
import Controller from './Controller'

declare class Essential extends Controller {

    public restart(settings: Object): Promise<Result>
    public executeAction(idAction: String, settings: Object): Promise<Result>
    public getAll(): Promise<Result>

}

export default Essential



