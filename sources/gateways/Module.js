import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    app.get("/api/modules/configuration", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/modules/configuration'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(
                    core.controller.module.getAllConfiguration(
                        core.controller.module.getByHash(
                            request.params.idModule
                        ).data
                    )
                )
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.get("/api/modules/:idModule/configuration", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/modules/:idModule/configuration'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(
                    core.controller.module.getConfiguration(
                        core.controller.module.getByHash(
                            request.params.idModule
                        ).data
                    )
                )
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.get("/api/modules/:idModule/state", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/modules/:idModule/state'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(
                    await core.controller.module.getState(
                        core.controller.module.getByHash(
                            request.params.idModule
                        ).data
                    )
                )
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.post("/api/modules/:idModule/datasources/:idDataSource",
        body('settings').isArray().withMessage("Invalid settings"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/modules/:idModule/datasources/:idDataSource'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.module.getDataSourceValue(
                        core.controller.module.getByHash(
                            request.params.idModule
                        ).data,
                        request.params.idDataSource,
                        request.body.settings
                    ))

                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    app.post("/api/modules/:idModule/actions/:idAction",
        body('settings').isArray().withMessage("Invalid settings"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/modules/:idModule/actions/:idAction'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.module.executeAction(
                        core.controller.module.getByHash(request.params.idModule).data,
                        request.params.idAction,
                        request.body.settings
                    ))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

}