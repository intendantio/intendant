import Result from '../utils/Result'
import Authentification from './Authentification'
import Cache from './Cache'
import Controller from './Controller'
import Market from './Market'
import Notification from './Notification'
import Process from './Process'
import Profile from './Profile'
import Routine from './Routine'
import Smartobject from './Smartobject'
import Storage from './Storage'
import User from './User'
import Widget from './Widget'


interface Controllers {
    storage: Storage,
    smartobject: Smartobject,
    routine: Routine,
    profile: Profile,
    process: Process,
    widget: Widget,
    user: User,
    cache: Cache,
    market: Market,
    notification: Notification,
    authentification: Authentification
}

declare class Essential extends Controller {

    controllers: Controllers

    public sendNotification(settings: Object): Promise<Result>
    public enableRoutine(settings: Object): Promise<Result>
    public disableRoutine(settings: Object): Promise<Result>
    public restart(settings: Object): Promise<Result>
    public executeAction(idAction: String, settings: Object): Promise<Result>
    public getAll(): Promise<Result>

}

export default Essential



