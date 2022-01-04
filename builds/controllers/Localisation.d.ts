import Controller from './Controller';
import Result from '../utils/Result'

declare class Localisation extends Controller {

    constructor(smartobjectController: Controller)

    public getAll(): Promise<Result>

}

//TODO

export default Localisation



