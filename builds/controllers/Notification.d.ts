import Controller from './Controller';
import Result from '../utils/Result'

declare class Notification extends Controller {

    public notify(title: String, message: String, tokens: Array<String>): Promise<Result>
    
}

export default Notification



