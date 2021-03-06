import * as cors from 'cors'
import Package from '../package.json'
import Smartobject from './Smartobject'
import User from './User'
import Profile from './Profile'
import Process from './Process'
import Authentification from './Authentification'
import Authorization from './Authorization'
import Module from './Module'
import System from './System'
import Room from './Room'
import Tracing from '../utils/Tracing'
import Essential from './Essential'
import Rapport from './Rapport'
import Result from '../utils/Result'
import Automation from './Automation'
import Position from './Position'

class API {

    constructor(core) {
        const app = require('express')()

        app.use(require('body-parser').json({ limit: '50mb', extended: true }))
        app.use(cors.default())

        Authorization(app, core)
        Authentification(app, core)
        Smartobject(app, core)
        User(app, core)
        Profile(app, core)
        Automation(app, core)
        Process(app, core)
        Module(app, core)
        System(app, core)
        Room(app, core)
        Essential(app, core)
        Rapport(app, core)
        Position(app, core)

        app.use("/api", (request, res) => {
            res.send(new Result(Package.name, true, "Invalid method"))
        })

        app.use("/api/*", (request, res) => {
            res.send(new Result(Package.name, true, "Invalid method"))
        })

        app.use((request, res) => {
            res.redirect('/admin')
        })

        app.listen(process.env.PORT, () => {
            Tracing.verbose(Package.name, "Listening localhost:" + process.env.PORT)
        })
    }

}

export default API