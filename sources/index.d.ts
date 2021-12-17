import Authentification from './controllers/Authentification'
import Cache from './controllers/Cache'
import Client from './controllers/Client'
import Espace from './controllers/Espace'
import Market from './controllers/Market'
import Notification from './controllers/Notification'
import Process from './controllers/Process'
import Profile from './controllers/Profile'
import Routine from './controllers/Routine'
import Smartobject from './controllers/Smartobject'
import Storage from './controllers/Storage'
import User from './controllers/User'
import Widget from './controllers/Widget'
import Connector from './connector'
import API from './gateways'

interface Configuration { }

interface Managers { }

interface Controllers {
    storage: Storage,
    smartobject: Smartobject,
    routine: Routine,
    profile: Profile,
    process: Process,
    client: Client,
    widget: Widget,
    user: User,
    cache: Cache,
    espace: Espace,
    market: Market,
    notification: Notification,
    authentification: Authentification
}

declare class Core {
    
    constructor(configuration: Configuration);

    public configuration: Configuration;
    public connector: Connector;
    public salt: String;
    public controller: Controllers;
    public manager: Managers;
    public api: API;
}

export default Core