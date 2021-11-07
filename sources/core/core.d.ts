import Controller from './controllers/Controller'
import Tracing from '@intendant/tracing'
import Connector from '@intendant/connector'

interface TracingConfiguration {
    verbose: Boolean,
    warning: Boolean,
    error: Boolean
}

interface Configuration {
    port: String,
    token: String,
    connector: typeof Connector,
    tracing: TracingConfiguration
}

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
    market: Controller
}

declare class Core {
    constructor(configuration: Configuration, connector: Connector, logger: Tracing);

    configuration: Configuration;
    logger: Tracing;
    connector: Connector;
    salt: String;
    controller: Controllers;
    public prepare(): null;
}

export default Core