import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    app.post('/api/markets/install',
        body('package').isString().withMessage("Invalid package"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/markets/install'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.market.install(request.body.package))
                }
            } else {
                let error = resultValid.array({ onlyFirstError: true }).pop()
                result.send(new Result(Package.name, true, error.msg))
            }
        })

    app.post('/api/markets/upgrade',
        body('package').isString().withMessage("Invalid package"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/markets/upgrade'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.market.upgrade(request.body.package))
                }
            } else {
                let error = resultValid.array({ onlyFirstError: true }).pop()
                result.send(new Result(Package.name, true, error.msg))
            }
        })

    app.post('/api/markets/uninstall',
        body('package').isString().withMessage("Invalid package"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/markets/uninstall'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.market.uninstall(request.body.package))
                }
            } else {
                let error = resultValid.array({ onlyFirstError: true }).pop()
                result.send(new Result(Package.name, true, error.msg))
            }
        })

}