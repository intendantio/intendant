import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    app.get('/api/users', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/users'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.user.getAll())
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.get('/api/users/:idUser', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/users/:idUser'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.user.getOne(request.params.idUser))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.post('/api/users/:idUser/dashboards',
        body('type').isString().withMessage("Invalid type"),
        body('object').isNumeric().withMessage("Invalid object"),
        body('action').isString().withMessage("Invalid action"),
        body('x').isNumeric().withMessage("Invalid x"),
        body('y').isNumeric().withMessage("Invalid y"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/users/:idUser/dashboards'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.user.insertUserDashboard(
                        request.params.idUser,
                        request.body.type,
                        request.body.object,
                        request.body.action,
                        request.body.x,
                        request.body.y
                    )
                    )
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    app.delete('/api/users/:idUser/dashboards/:idUserDashboard',
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/users/:idUser/dashboards/:idUserDashboard'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.user.deleteUserDashboard(request.params.idUserDashboard)
                    )
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

        app.post('/api/users/:idUser/dashboards/:idUserDashboard',
        body('x').isNumeric().withMessage("Invalid x"),
        body('y').isNumeric().withMessage("Invalid y"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/users/:idUser/dashboards/:idUserDashboard'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.user.updateUserDashboard(request.params.idUserDashboard,request.body.x,request.body.y)
                    )
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    app.post('/api/users',
        body('login').isString().isLength({ min: 5 }).withMessage("Invalid login {min: 5}"),
        body('password').isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 }).withMessage("Invalid password {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1}"),
        body('imei').isString().withMessage("Invalid imei"),
        body('profile').isNumeric().withMessage("Invalid profile"),
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/users'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.user.insert(request.body))
                }
            } else {
                let error = resultValid.array({ onlyFirstError: true }).pop()
                result.send(new Result(Package.name, true, error.msg))
            }
        })




    app.delete('/api/users/:idUser', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/users/:idUser'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.user.delete(
                    request.params.idUser
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.post('/api/users/:idUser/password', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/users/:idUser/password'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.user.updatePassword(
                    request.params.idUser,
                    request.body.password
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    app.post('/api/users/:idUser/profile', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/users/:idUser/profile'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.user.updateProfile(
                    request.params.idUser,
                    request.body.profile
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })
}