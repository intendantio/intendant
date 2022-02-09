import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {
    app.get("/api/ping", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/ping'
            let resultGetStarted = await core.controller.user.getStarted()
            if (resultGetStarted.error) {
                result.send(resultGetStarted.error)
            } else {
                result.send({
                    version: Package.version,
                    getStarted: resultGetStarted.getStarted,
                    error: false,
                    message: "pong",
                    package: Package.name
                })
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })
}