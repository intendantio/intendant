import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    //Get all links
    app.get("/api/links", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/links"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.link.getAll())
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Get one links
    app.get("/api/links/:idLink", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/links/:idLink"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.link.getOne(request.params.idLink))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Insert links

    app.post("/api/links", 
        body('name').isString().withMessage("Invalid name"),
        body('room').isNumeric().withMessage("Invalid room"),
    async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/links"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.link.insert(request.body))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })


    //Delete links
    app.delete("/api/links/:idLink", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/links/:idLink"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.link.delete(request.params.idLink))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

}