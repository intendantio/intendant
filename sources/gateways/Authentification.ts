import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    app.post('/api/authentification', async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = '/authentification'
            if (request.body.refresh) {
                result.send(await core.controller.authentification.getTokenWithRefresh(request.body.refresh))
            } else {
                result.send(await core.controller.authentification.getToken(request.body.login, request.body.password))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

}