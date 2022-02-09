import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    //Get all rapports
    app.get("/api/rapports",
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/rapports'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.rapport.getAll())
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Get one rapport
    app.get("/api/rapports/:idRapport",
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/rapports/:idRaport'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.rapport.getOne(request.params.idRapport))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Get all data
    app.get("/api/rapports/:idRapport/data/:start/:end",
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/rapports/:idRapport'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.rapport.getData(request.params.idRapport, request.params.start, request.params.end))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Insert new rapport
    app.post("/api/rapports",
        body('chart').isIn(["lineChart"]).withMessage("Invalid chart"),
        body('type').isIn(["smartobject", "module"]).withMessage("Invalid type"),
        body('object').notEmpty().not().isObject().not().isArray().withMessage("Invalid object"),
        body('reference').isString().withMessage("Invalid reference"),
        body('interval').isNumeric().withMessage("Invalid interval {min:120}"),
        body('settings').isArray().withMessage("Invalid settings"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/rapports"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.rapport.insert(request.body))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Delete rapport
    app.delete("/api/rapports/:idRapport",
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/rapports/:idRapport"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.rapport.delete(request.params.idRapport))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Truncate data rapport
    app.patch("/api/rapports/:idRapport",
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/rapports/:idRapport"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.rapport.truncate(request.params.idRapport))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Insert new rapport data
    app.post("/api/rapports/:idRapport/data",
        body('value').notEmpty().withMessage("Invalid value"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/rapports/:idRapport/data"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.rapport.insertData(
                        request.params.idRapport,
                        request.body.value
                    ))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

}