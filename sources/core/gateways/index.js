import Express from 'express'
import bodyParser from 'body-parser'
import * as cors from 'cors'
import Package from '../package.json'
import Smartobject from './Smartobject'
import User from './User'
import Profile from './Profile'
import Routine from './Routine'
import Process from './Process'
import Authentification from './Authentification'
import Authorization from './Authorization'
import Module from './Module'
import Ping from './Ping'
import GetStarted from './GetStarted'
import Client from './Client'
import Widget from './Widget'
import Configuration from './Configuration'
import Market from './Market'

class API {

    static initialisation(core) {
        const app = Express()
        app.use(bodyParser.json({ limit: '50mb', extended: true }))
        app.use(cors.default())

        app.use("/admin", Express.static(__dirname + '/../public'))
        app.use("/admin/*", Express.static(__dirname + '/../public'))

        Authorization(app,core)
        Authentification(app,core)
        Smartobject(app,core)
        User(app,core)
        Profile(app,core)
        Routine(app,core)
        Process(app,core)
        Module(app,core)
        Ping(app,core)
        GetStarted(app,core)
        Client(app,core)
        Widget(app,core)
        Configuration(app,core)
        Market(app,core)

        app.use((request, res) => {
            res.status(404).send({ message: "Route not found", code: 404 })
        })

        app.listen(core.configuration.port, () => {
            core.logger.verbose(Package.name, "Start Intendant")
            core.logger.verbose(Package.name, "Start listening localhost:" + core.configuration.port)
        })
    }

}

export default API