import Package from './package.json'

import Smartobject from './controllers/Smartobject'
import Authentification from './controllers/Authentification'
import Process from './controllers/Process'
import Profile from './controllers/Profile'
import Storage from './controllers/Storage'
import Widget from './controllers/Widget'
import Cache from './controllers/Cache'
import User from './controllers/User'
import Market from './controllers/Market'
import Notification from './controllers/Notification'
import Room from './controllers/Room'
import Essential from './controllers/Essential'
import Module from './controllers/Module'
import Rapport from './controllers/Rapport'
import Cloud from './controllers/Cloud'
import Automation from './controllers/Automation'

import API from './gateways'

import SmartobjectManager from './managers/Smartobject'
import ModulesManager from './managers/Module'
import AutomationManager from './managers/Automation'
import RapportManager from './managers/Rapports'

import Tracing from './utils/Tracing'

import Connector from './connector'

class Core {
    constructor(configuration) {
        console.clear()
        Tracing.welcome()

        Connector.migration(() => {

            this.configuration = configuration

            /* Manager */
            this.manager = {}
            this.manager.smartobject = new SmartobjectManager(this)
            this.manager.module = new ModulesManager(this)
            this.manager.automation = new AutomationManager(this)
            this.manager.rapport = new RapportManager(this)

            /* Controller */
            this.controller = {
                authentification: new Authentification(),
                automation: new Automation(),
                module: new Module(),
                market: new Market(),
                profile: new Profile(),
                storage: new Storage(),
                user: new User(),
                cache: new Cache(),
                notification: new Notification(),
                smartobject: new Smartobject(),
                widget: new Widget(),
                rapport: new Rapport(),
                room: new Room(),
                essential: new Essential(),
                process: new Process(),
                cloud: new Cloud()
            }

            this.controller.authentification.token = configuration.token
            this.controller.authentification.salt = Package.name


            this.controller.module.addManager(this.manager.module)

            this.controller.market.addManager(this.manager.smartobject)
            this.controller.market.addManager(this.manager.module)

            this.controller.smartobject.addManager(this.manager.smartobject)
            this.controller.smartobject.addController(this.controller.user)

            this.controller.widget.addManager(this.manager.smartobject)
            this.controller.widget.addManager(this.manager.module)
            this.controller.widget.addController(this.controller.module)
            this.controller.widget.addController(this.controller.smartobject)

            this.controller.rapport.addManager(this.manager.rapport)
            this.controller.rapport.addController(this.controller.widget)
            this.controller.rapport.addController(this.controller.smartobject)

            this.controller.room.addController(this.controller.smartobject)

            this.controller.process.addManager(this.manager.smartobject)
            this.controller.process.addManager(this.manager.module)
            this.controller.process.addController(this.controller.essential)

            this.controller.automation.addManager(this.manager.automation)

            this.manager.smartobject.addController(this.controller.smartobject)
            this.manager.automation.addController(this.controller.automation)
            this.manager.automation.addManager(this.manager.smartobject)
            this.manager.automation.addController(this.controller.smartobject)
            this.manager.automation.addController(this.controller.process)

            setTimeout(() => {
                this.api = new API(this)
                this.manager.rapport.before()
                this.manager.smartobject.before()
                setTimeout(() => {
                    this.manager.automation.before()
                }, 1000)
            }, 1000)
        })
    }

}

export default Core