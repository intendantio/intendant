import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'
import fs from 'fs'

export default (app, core) => {

    app.get("/api/logs", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/logs'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                let finalLogs = []
                if (fs.existsSync("./intendant.log")) {
                    let logs = fs.readFileSync("./intendant.log").toString()
                    let tmpLogs = logs.split("\n")
                    tmpLogs.pop()
                    finalLogs = tmpLogs.map(line => {
                        let objectLine = { date: 0, type: "UNKNOWN", object: "UNKNOWN", message: "UNKNOWN" }
                        try {
                            objectLine = JSON.parse(line)
                        } catch (error) { }
                        return objectLine
                    })
                }
                result.send(new Result(Package.name, false, "", finalLogs))
            }

        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.get("/api/configurations", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/configurations'
            let resultGetStarted = await core.controller.user.getStarted()
            if (resultGetStarted.error) {
                result.send(resultGetStarted.error)
            } else {
                result.send(new Result(Package.name, false, "", {
                    getStarted: resultGetStarted.getStarted,
                    version: Package.version,
                    build: Package.build
                }))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.get("/api/upgrade", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/upgrade'
            let resultGetStarted = await core.controller.user.getStarted()
            if (resultGetStarted.error) {
                result.send(resultGetStarted.error)
            } else {
                result.send(await core.controller.system.checkUpgrade())
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.post("/api/upgrade", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/upgrade'
            let resultGetStarted = await core.controller.user.getStarted()
            if (resultGetStarted.error) {
                result.send(resultGetStarted.error)
            } else {
                result.send(await core.controller.system.upgrade())
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })


    app.post("/api/configurations",
        body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }).withMessage("Invalid password {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1}"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/configurations/upgrade'
                let resultGetStarted = await core.controller.user.getStarted()
                if (resultGetStarted.error) {
                    result.send(resultGetStarted.error)
                } else if (resultGetStarted.getStarted) {
                    result.send(
                        await core.controller.user.insert({
                            login: "admin",
                            password: request.body.password,
                            imei: "",
                            profile: 1
                        })
                    )
                } else {
                    result.send(new Result(Package.name, true, "Invalid core state"))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

}