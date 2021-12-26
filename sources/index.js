import Package from './package.json'

import Routine from './controllers/Routine'
import Smartobject from './controllers/Smartobject'
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
        Tracing.welcome()

        this.configuration = configuration

        this.salt = Package.name + "-" + Package.version


        /* Manager */
        this.manager = {}
        this.manager.smartobject = new SmartObjectManager(this)
        this.manager.module = new ModulesManager(this)
        this.manager.routine = new RoutineManager(this)

        /* Controller */
        this.controller = {
            authentification: new Authentification(this.configuration.token, this.salt),
            smartobject: new Smartobject(this.manager.smartobject),
            routine: new Routine(this.manager.routine),
            widget: new Widget(this.manager.smartobject, this.manager.module),
            market: new Market(this.manager.smartobject, this.manager.module),
            process: new Process(this.manager.smartobject, this.manager.module),
            profile: new Profile(),
            storage: new Storage(),
            client: new Client(),
            user: new User(),
            cache: new Cache(),
            espace: new Espace(),
            notification: new Notification()
        }

        
            
        setTimeout(() => {
            this.api = new API(this)
        },1000)

    }

}

export default Core