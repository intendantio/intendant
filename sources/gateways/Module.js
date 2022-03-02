import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    app.get("/api/modules", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/modules'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(
                    core.controller.module.getAll()
                )
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    
    app.patch("/api/modules/:idModule", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/modules/:idModule'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(
                    await core.controller.module.install(
                        request.params.idModule
                    )
                )
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.get("/api/modules/:idModule", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/modules/:idModule'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(
                    core.controller.module.getOne(
                        core.controller.module.getBySum(
                            request.params.idModule
                        ).data
                    )
                )
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.post("/api/modules/:idModule/actions/:idAction",
        body('settings').isObject().withMessage("Invalid settings"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/modules/:idModule/actions/:idAction'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.module.executeAction(
                        core.controller.module.getBySum(request.params.idModule).data,
                        request.params.idAction,
                        request.body.settings
                    ))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

}