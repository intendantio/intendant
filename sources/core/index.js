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
import Math from './controllers/tools/Math'

import SmartObjectManager from './managers/Smartobject'
import ModulesManager from './managers/Modules'
import RoutineManager from './managers/Routine'
import Connector from './connector'
import Tracing from './tracing'

import fs from 'fs'

class Core {
    constructor(configuration) {
        if (configuration.tracing == undefined) {
            logger.verbose = () => { }
            logger.warning = () => { }
            logger.error = () => { }
        } else {
            if (configuration.tracing.verbose == undefined || configuration.tracing.verbose == false) {
                logger.verbose = () => { }
            }
            if (configuration.tracing.warning == undefined || configuration.tracing.warning == false) {
                logger.warning = () => { }
            }
            if (configuration.tracing.error == undefined || configuration.tracing.error == false) {
                logger.error = () => { }
            }
        }
        this.configuration = configuration
        this.logger = Tracing

        this.connector = Connector
        this.salt = Package.name + "-" + Package.version

        /* Controller */
        this.logger.verbose(Package.name, "Core : instanciate controller")
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

        setTimeout(() => {
            /* Manager */
            this.logger.verbose(Package.name, "Core : instanciate manager")
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