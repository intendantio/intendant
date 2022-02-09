import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    //Get all smartobject
    app.get('/api/smartobjects', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.smartobject.getAll())
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Get all smartobject
    app.get('/api/smartobjects/configuration', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects/configuration'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.smartobject.getAllConfiguration())
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Get one smartobject
    app.get('/api/smartobjects/:idSmartobject', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects/:idSmartobject'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.smartobject.getOne(
                    request.params.idSmartobject
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Insert smartobject 
    app.post('/api/smartobjects',
        body('module').isString().withMessage("Invalid module"),
        body('reference').isString().withMessage("Invalid reference"),
        body('room').isNumeric().withMessage("Invalid room"),
        body('settings').isArray().withMessage("Invalid settings"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/smartobjects'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.smartobject.insert(request.body))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    // Delete smartobject
    app.delete('/api/smartobjects/:idSmartobject', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects/:idSmartobject'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.smartobject.delete(
                    request.params.idSmartobject
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Insert smartobject settings
    app.post('/api/smartobjects/:idSmartobject/arguments',
        body('value').isString().withMessage("Invalid value"),
        body('reference').isString().withMessage("Invalid reference"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/smartobjects/:idSmartobject/arguments'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.smartobject.insertArguments(request.params.idSmartobject, request.body))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Delete smartobject arguments
    app.delete('/api/smartobjects/:idSmartobject/arguments/:idArgument', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects/:idSmartobject/arguments/:idArgument'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.smartobject.deleteArguments(
                    request.params.idArgument,
                    request.params.idSmartobject
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    // Execute one action 
    //TODO Rework
    app.post('/api/smartobjects/:idSmartobject/actions/:idAction', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects/:id/actions/:idAction'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.smartobject.executeAction(
                    request.params.idSmartobject,
                    request.params.idAction,
                    authorization.profile,
                    request.body.settings,
                    false,
                    authorization.user
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    // Insert smartobject profiles
    app.post("/api/smartobjects/:idSmartobject/profiles", 
        body('idProfile').isNumeric().withMessage("Invalid profile"),
    async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/smartobjects/:idSmartobject/profiles"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.smartobject.insertSmartobjectProfile(
                    request.params.idSmartobject,
                    request.body.idProfile
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    // Delete smartobject profiles
    app.delete("/api/smartobjects/:idSmartobject/profiles/:idProfile", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/smartobjects/:idSmartobject/profiles/:idProfile"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.smartobject.deleteSmartobjectProfile(
                    request.params.idSmartobject,
                    request.params.idProfile
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Update rooms

    app.post("/api/smartobjects/:idSmartobject/room",
        body('idRoom').isNumeric().withMessage("Invalid room"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/smartobjects/:idSmartobject/room"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.smartobject.updateRoom(request.params.idSmartobject, request.body.idRoom))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

}