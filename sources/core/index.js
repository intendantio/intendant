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

import fs from 'fs'

class Core {
    constructor(configuration, connector, logger) {
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
        logger.verbose(Package.name, "Start Core")
        this.configuration = configuration
        this.logger = logger
        this.connector = connector
        this.salt = Math.random(16)

        this.prepare()

        /* Controller */
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
            this.manager = {}
            this.manager.smartobject = new SmartObjectManager(this)
            this.manager.routine = new RoutineManager(this)
            this.manager.module = new ModulesManager(this)
        },100)

    }

    prepare() {
        this.configuration.smartobjects = []
        this.configuration.modules = []
        if(fs.existsSync("./.intendant") == false) {
            fs.mkdirSync("./.intendant/@intendant",{recursive: true})
        }
        let dirsModule = fs.readdirSync('./.intendant/@intendant')
        for (let dir = 0; dir < dirsModule.length; dir++) {
            let currentConfiguration = JSON.parse(fs.readFileSync('./.intendant/@intendant/' + dirsModule[dir] + "/configuration.json").toString())
            if(currentConfiguration.type == "smartobject") {
                this.configuration.smartobjects.push(currentConfiguration.id)
            } else if(currentConfiguration.type == "module") {
                this.configuration.modules.push(currentConfiguration.id)
            }
        }
    }
    
}

export default Core