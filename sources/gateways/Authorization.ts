import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    app.get('/api/authorizations', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/authorizations'
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.authentification.getAll())
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

}