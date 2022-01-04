import Controller from './Controller';
import Result from '../utils/Result'

declare class Market extends Controller {

    constructor(close: Function, smartobjectManager: Object, moduleManager: Object)
    
    public install(pPackage: String): Promise<Result>
    public uninstall(pPackage: String): Promise<Result>
    public upgrade(pPackage: String): Promise<Result>
    
}

export default Market



