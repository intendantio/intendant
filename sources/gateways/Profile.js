import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    app.get('/api/profiles/:idProfile',
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/profiles/:idProfile'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.profile.getOne(request.params.idProfile))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    app.get('/api/profiles',
        async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = '/profiles'
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.profile.getAll())
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })


}