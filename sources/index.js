import Package from './package.json'

import Smartobject from './controllers/Smartobject'
import Authentification from './controllers/Authentification'
import Process from './controllers/Process'
import Profile from './controllers/Profile'
import Storage from './controllers/Storage'
import Widget from './controllers/Widget'
import Cache from './controllers/Cache'
import User from './controllers/User'
import Notification from './controllers/Notification'
import Room from './controllers/Room'
import Essential from './controllers/Essential'
import Module from './controllers/Module'
import Rapport from './controllers/Rapport'
import Automation from './controllers/Automation'
import System from './controllers/System'
import Position from './controllers/Position'

import API from './gateways'

import SmartobjectManager from './managers/Smartobject'
import ModulesManager from './managers/Module'
import AutomationManager from './managers/Automation'
import RapportManager from './managers/Rapports'

import Tracing from './utils/Tracing'

import Env from 'dotenv'
import fetch from 'node-fetch'
import { v4 as uuidv4 } from 'uuid'

Env.config()

import Connector from './connector'
import Utils from './utils/Utils'
import Configuration from './configuration.json'

class Core {
    constructor() {

        console.clear()
        Tracing.welcome()

        if (process.env.PORT == undefined) {
            Tracing.warning(Package.name, "Missing PORT variable on .env file")
            Tracing.warning(Package.name, "Set 3000 default port")
            process.env.PORT = 3000
        }
        if (process.env.SECRET == undefined) {
            Tracing.warning(Package.name, "Missing SECRET variable on .env file")
            Tracing.warning(Package.name, "Self generate secret passphrase")
            process.env.SECRET = Utils.generateSingleCodeUnique()
        }
        if (process.env.ENABLE_CLOUD == undefined) {
            Tracing.warning(Package.name, "Missing ENABLE_CLOUD variable on .env file")
            Tracing.warning(Package.name, "Set true default")
            process.env.ENABLE_CLOUD = true
        }
        if (process.env.INSTANCE == undefined) {
            Tracing.warning(Package.name, "Missing INSTANCE variable on .env file")
            Tracing.warning(Package.name, "Set 'community' to default")
            process.env.INSTANCE = 'community'
        }
        if (process.env.PUBLIC_CLOUD == undefined) {
            Tracing.warning(Package.name, "Missing PUBLIC_CLOUD variable on .env file")
            Tracing.warning(Package.name, "Set 'unknown' to default")
            process.env.PUBLIC_CLOUD = 'unknown'
        }
        if (process.env.NAME_CLOUD == undefined) {
            Tracing.warning(Package.name, "Missing NAME_CLOUD variable on .env file")
            Tracing.warning(Package.name, "Set 'unknown' to default")
            process.env.NAME_CLOUD = 'unknown'
        }

        Connector.migration(() => {


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
                system: new System(),
                position: new Position()
            }

            this.controller.authentification.token = process.env.SECRET
            this.controller.authentification.salt = Package.name


            this.controller.module.addManager(this.manager.module)

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
                this.manager.smartobject.before()
                setTimeout(() => {
                    this.manager.rapport.before()
                    setTimeout(() => {
                        this.manager.automation.before()
                        this.autoRegister()
                    }, 1000)
                }, 1000)
            }, 1000)
        })
    }

    async autoRegister() {
        if (process.env.ENABLE_CLOUD) {
            Tracing.verbose(Package.name, "With cloud register")
            let resultUuid = await this.controller.storage.getItem(Package.name + "/uuid")
            if (resultUuid.error) {
                Tracing.error(Package.name, resultUuid.message)
                return
            }
            if (resultUuid.data == false) {
                this.uuid = uuidv4()
            } else {
                this.uuid = resultUuid.data
            }
            
            let resultAdmin = await this.controller.authentification.getAdminToken()
            if (resultAdmin.error) {
                Tracing.error(Package.name, resultAdmin.message)
                return
            }
            let result = await fetch(Configuration.discover.replace(":uuid", this.uuid), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    type: process.env.INSTANCE,
                    name: process.env.NAME_CLOUD,
                    path: process.env.PUBLIC_CLOUD,
                    token: resultAdmin.data.access_token
                })
            })
            let resultJSON = await result.json()
            if (resultJSON.error) {
                Tracing.error(Package.name, resultJSON.message)
                return
            }
            let resultStorage = await this.controller.storage.setItem(Package.name + "/uuid", this.uuid)
            if (resultStorage.error) {
                Tracing.error(Package.name, resultStorage.message)
                return
            }

            Tracing.verbose(Package.name, "uuid " + this.uuid)
        }
    }

}

export default Core