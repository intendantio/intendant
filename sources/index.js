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
import Localisation from './controllers/Localisation'
import Essential from './controllers/Essential'
import Module from './controllers/Module'
import Rapport from './controllers/Rapport'

import API from './gateways'

import SmartobjectManager from './managers/Smartobject'
import ModulesManager from './managers/Modules'
import RoutineManager from './managers/Routine'
import RapportManager from './managers/Rapports'
import Tracing from './utils/Tracing'

class Core {
    constructor(configuration) {
        console.clear()
        Tracing.welcome()

        this.configuration = configuration

        this.salt = Package.name

        /* Manager */
        this.manager = {}
        this.manager.smartobject = new SmartobjectManager(this)
        this.manager.module = new ModulesManager(this)
        this.manager.routine = new RoutineManager(this)
        this.manager.rapport = new RapportManager(this)

        /* Controller */
        this.controller = {
            authentification: new Authentification(this.configuration.token, this.salt),
            smartobject: new Smartobject(this.manager.smartobject),
            routine: new Routine(this.manager.routine),
            module: new Module(this.manager.module),
            market: new Market(this.manager.smartobject, this.manager.module),
            profile: new Profile(),
            storage: new Storage(),
            client: new Client(),
            user: new User(),
            cache: new Cache(),
            espace: new Espace(),
            notification: new Notification(),
            rapport: new Rapport(this.manager.rapport)
        }

        this.controller.widget = new Widget(this.manager.smartobject, this.manager.module, this.controller.module, this.controller.smartobject),
        this.controller.localisation = new Localisation(this.controller.smartobject)
        this.controller.essential = new Essential(this.controller)
        this.controller.process = new Process(this.manager.smartobject, this.manager.module,this.controller.essential)

        this.manager.rapport.initialisation()

        setTimeout(() => {
            this.api = new API(this)
        },1000)
    }

}

export default Core