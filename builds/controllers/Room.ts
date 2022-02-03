import Controller from './Controller';
import Result from '../utils/Result'

declare class Room extends Controller {

    constructor(smartobjectController: Controller)

    public getAll(): Promise<Result>

}


export default Room



