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

    //Get all smartobject configuration
    app.get('/api/smartobjects/configurations', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects/configurations'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.smartobject.getAllPackage())
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
                    result.send(await core.controller.smartobject.insert(
                        request.body.reference,
                        request.body.module,
                        request.body.room,
                        request.body.settings
                    )
                    )
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Insert smartobject 
    app.post('/api/smartobjects/:idSmartobject',
        body('settings').isArray().withMessage("Invalid settings"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/smartobjects'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.smartobject.regenerate(
                        request.params.idSmartobject,
                        request.body.settings
                    )
                    )
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

    // Execute one action 
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
                    request.body.settings,
                    authorization.data.idProfile
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    // Execute one action (without body)
    app.get('/api/smartobjects/:idSmartobject/actions/:idAction', async (request, result) => {
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
                    {},
                    authorization.data.idProfile
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.patch("/api/smartobjects",
        body('package').isString().withMessage("Invalid package"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/smartobjects'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(
                        await core.controller.smartobject.install(
                            request.body.package
                        )
                    )
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

    //Update rooms
    app.post("/api/smartobjects/:idSmartobject/position",
        body('idPosition').isNumeric().withMessage("Invalid position"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/smartobjects/:idSmartobject/position"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.smartobject.updatePosition(request.params.idSmartobject, request.body.idPosition))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Update reference
    app.post("/api/smartobjects/:idSmartobject/reference",
        body('reference').isString().withMessage("Invalid reference"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/smartobjects/:idSmartobject/reference"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.smartobject.updateReference(request.params.idSmartobject, request.body.reference))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Restart one smartobject
    app.post("/api/smartobjects/:idSmartobject/restart", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects/:idSmartobject/restart'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.manager.smartobject.update(request.params.idSmartobject))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Get all widget of one smartobject
    app.get('/api/smartobjects/:idSmartobject/widgets', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects/:idSmartobject/widgets'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.widget.getAllWidgets(
                    request.params.idSmartobject
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Get one widget of one smartobject
    app.get('/api/smartobjects/:idSmartobject/widgets/:idWidget', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects/:idSmartobject/widgets/:idWidget'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.widget.getOne(
                    request.params.idSmartobject,
                    request.params.idWidget,
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Home assistant

    //Get Home Sync Data
    app.get('/api/smartobjects/assistant/syncData', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects/assistant/syncData'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.smartobject.getSyncData())
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Get Home Sync Query
    app.post('/api/smartobjects/assistant/syncQuery', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects/assistant/syncQuery'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.smartobject.getSyncQuery(request.body))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })


    //Get Home Sync Query
    app.post('/api/smartobjects/assistant/syncExecute', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/smartobjects/assistant/syncExecute'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.smartobject.getSyncExecute(request.body))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

}