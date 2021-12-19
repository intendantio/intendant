import Package from './package.json'

import Routine from './controllers/Routine'
import SmartObject from './controllers/SmartObject'
import Authentification from './controllers/Authentification'
import Process from './controllers/Process'
import Profile from './controllers/Profile'
import Storage from './controllers/Storage'
import Client from './controllers/Client'
import Widget from './controllers/Widget'
import Cache from './controllers/Cache'
import User from './controllers/User'
import Espace from './controllers/Espace'
import Market from './controllers/Market'
import Notification from './controllers/Notification'


import API from './gateways'

import SmartObjectManager from './managers/Smartobject'
import ModulesManager from './managers/Modules'
import RoutineManager from './managers/Routine'
import Tracing from './utils/Tracing'

class Core {
    constructor(configuration) {
        console.clear()
        Tracing.pure(""+
        "       _                            _                          \n"+
        "      | |       _                  | |             _           \n"+
        "      | |____ _| |_ _____ ____   __| |_____ ____ _| |_         \n"+
        "      | |  _ (_   _) ___ |  _ \\ / _  (____ |  _ (_   _)       \n"+
        "      | | | | || |_| ____| | | ( (_| / ___ | | | || |_         \n"+
        "      |_|_| |_| \\__)_____)_| |_|\\____\\_____|_| |_| \\__)    \n"+
        "")
        Tracing.pure("           Version: " + Package.version + " Build: " + Package.build)
        Tracing.pure("")
        this.configuration = configuration

        this.salt = Package.name + "-" + Package.version

        this.api = new API(this)

        /* Controller */
        Tracing.verbose(Package.name, "Core : instanciate controller")
        this.controller = {
            routine: new Routine(this),
            smartobject: new SmartObject(this),
            authentification: new Authentification(this),
            profile: new Profile(this),
            process: new Process(this),
            storage: new Storage(this),
            client: new Client(this),
            widget: new Widget(this),
            user: new User(this),
            cache: new Cache(this),
            espace: new Espace(this),
            market: new Market(this),
            notification: new Notification(this)
        }

        setTimeout(() => {
            /* Manager */
            Tracing.verbose(Package.name, "Core : instanciate manager")
            this.manager = {}
            this.manager.smartobject = new SmartObjectManager(this)
            this.manager.module = new ModulesManager(this)
            setTimeout(() => {
                this.manager.routine = new RoutineManager(this)
            }, 5000)
        }, 100)

    }

}

export default Core