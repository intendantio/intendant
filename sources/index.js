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

import SmartObjectManager from './managers/Smartobject'
import ModulesManager from './managers/Modules'
import RoutineManager from './managers/Routine'
import Connector from './connector'
import Tracing from './utils/Tracing'

class Core {
    constructor(configuration) {
        this.configuration = configuration

        this.salt = Package.name + "-" + Package.version

        /* Controller */
        Tracing.verbose(Package.name, "Core : instanciate controller")
        this.controller = {}
        this.controller.routine = new Routine(this)
        this.controller.smartobject = new SmartObject(this)
        this.controller.authentification = new Authentification(this)
        this.controller.profile = new Profile(this)
        this.controller.process = new Process(this)
        this.controller.storage = new Storage(this)
        this.controller.client = new Client(this)
        this.controller.widget = new Widget(this)
        this.controller.user = new User(this)
        this.controller.cache = new Cache(this)
        this.controller.espace = new Espace(this)
        this.controller.market = new Market(this)
        this.controller.notification = new Notification(this)
        setTimeout(() => {
            /* Manager */
            Tracing.verbose(Package.name, "Core : instanciate manager")
            this.manager = {}
            this.manager.smartobject = new SmartObjectManager(this)
            this.manager.module = new ModulesManager(this)
            setTimeout(() => {
                this.manager.routine = new RoutineManager(this)
            },5000)
        }, 100)

    }

}

export default Core