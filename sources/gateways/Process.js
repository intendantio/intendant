import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    //Get all process
    app.get("/api/processes",
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/processes'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.process.getAll())
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Insert new porcess
    app.post("/api/processes",
        body('description').isString().withMessage("Invalid description"),
        body('description_on').isString().withMessage("Invalid description_on"),
        body('description_off').isString().withMessage("Invalid description_off"),
        body('mode').isIn(["button", "switch"]).withMessage("Invalid mode"),
        body('room').isNumeric().withMessage("Invalid room"),
        body('state').isIn(["on","off"]).withMessage("Invalid state"),
        body('actions').isArray().withMessage("Invalid actions"),
        body('inputs').isArray().withMessage("Invalid inputs"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/processes"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.process.insert(request.body))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Get one process
    app.get("/api/processes/:idProcess",
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/espace/:id/processes/:idProcess'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.process.getOne(request.params.idProcess))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Delete process
    app.delete("/api/processes/:idProcess",
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/processes/:idProcess"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.process.delete(request.params.idProcess))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    // Execute action
    app.post("/api/processes/:id/execute",
        body('inputs').isObject().withMessage("Invalid inputs"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/processes/:idprocess/execute'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.process.executeAction(request.params.id, authorization.profile, request.body.inputs))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    // Insert process profiles
    app.post("/api/processes/:idProcess/profiles",
        body('idProfile').isNumeric().withMessage("Invalid idProfile"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/processes/:idProcess/profiles"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.process.insertProcessProfile(
                        request.params.idProcess,
                        request.body.idProfile
                    ))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    // Delete process profiles
    app.delete("/api/processes/:idProcess/profiles/:idProfile",
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/processes/:idProcess/profiles/:idProfile"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.process.deleteProcessProfile(
                        request.params.idProcess,
                        request.params.idProfile
                    ))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

}