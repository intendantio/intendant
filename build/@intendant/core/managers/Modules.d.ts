import Connector from '@intendant/connector'

import Core from '../index'

declare module Modules {

    interface TracingConfiguration {
        verbose: Boolean,
        warning : Boolean,
        error : Boolean
    }

    interface Configuration {
        port: String,
        token: String,
        connector: Connector,
        tracing: TracingConfiguration
    }

    interface Logger {
        name: String,
        icon: String,
        settings: Array<Settings>,
        actions: Array<Actions>
    }


    class Modules {
        constructor(core: Core);
        public prepare(): null;
    }

}

export = Modules