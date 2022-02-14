import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    //Get all widget
    app.get("/api/widgets", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/widgets"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(
                    await core.controller.widget.getAll()
                )
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Get one widget
    app.get("/api/widgets/:idWidget", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/widgets/:idWidget"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(
                    await core.controller.widget.getOne(request.params.idWidget)
                )
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Insert widget
    app.post("/api/widgets",
        body('reference').isString().isLength({ min: 5 }).withMessage("Invalid reference {min: 5}"),
        body('type').isIn(["module", "smartobject"]).withMessage("Invalid type"),
        body('object').isString().withMessage("Invalid object"),
        body('settings').isArray().withMessage("Invalid settings"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/widgets"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(
                        await core.controller.widget.insert(
                            request.body.reference,
                            request.body.object,
                            request.body.type,
                            request.body.settings
                        )
                    )
                }
            } else {
                let error = resultValid.array({ onlyFirstError: true }).pop()
                result.send(new Result(Package.name, true, error.msg))
            }
        })

    //Delete widget
    app.delete("/api/widgets/:idWidget", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/widgets/:idWidget"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(
                    await core.controller.widget.delete(request.params.idWidget)
                )
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })


}