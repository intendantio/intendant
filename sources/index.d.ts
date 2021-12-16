import Controller from './controllers/Controller'
import Connector from './connector'
import API from './gateways'


interface Controllers {
    routine: Controller,
    smartobject: Controller,
    authentification: Controller,
    profile: Controller,
    process: Controller,
    storage: Controller,
    client: Controller,
    widget: Controller,
    user: Controller,
    cache: Controller,
    espace: Controller,
    market: Controller,
    notification: Controller
}

interface Managers {

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