import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

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

    app.post("/api/configurations",
        body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }).withMessage("Invalid password {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1}"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/configurations'
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