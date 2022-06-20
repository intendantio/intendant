import { body, validationResult } from 'express-validator'
import Result from '../utils/Result'
import Package from '../package.json'

export default (app, core) => {

    //Get all rooms
    app.get("/api/rooms", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/rooms"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.room.getAll())
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    //Get one rooms
    app.get("/api/rooms/:idRoom", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/rooms/:idRoom"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.room.getOne(request.params.idRoom))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

        //Get one rooms
        app.get("/api/rooms/:idRoom/processes", async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/rooms/:idRoom/processes"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.process.getAllByRoom(request.params.idRoom,true))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

        //Get one rooms
        app.get("/api/rooms/:idRoom/processes/withoutData", async (request, result) => {
            let resultValid = validationResult(request)
            if (resultValid.isEmpty()) {
                request.url = "/rooms/:idRoom/processes/withoutData"
                let authorization = await core.controller.authentification.checkAuthorization(request)
                if (authorization.error) {
                    result.send(authorization)
                } else {
                    result.send(await core.controller.process.getAllByRoom(request.params.idRoom,false))
                }
            } else {
                result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
            }
        })

    //Insert rooms

    app.post("/api/rooms", 
        body('name').isString().withMessage("Invalid name"),
        body('description').isString().withMessage("Invalid description"),
        body('icon').isString().withMessage("Invalid icon"),
    async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/rooms"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.room.insert(request.body))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })



    //Delete rooms

    app.delete("/api/rooms/:idRoom", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/rooms/:idRoom"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.room.delete(request.params.idRoom))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    // Insert room profiles
    app.post("/api/rooms/:idRoom/profiles", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/rooms/:idRoom/profiles"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.room.insertRoomProfile(
                    request.params.idRoom,
                    request.body.idProfile
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

    // Delete room profiles
    app.delete("/api/rooms/:idRoom/profiles/:idProfile", async (request, result) => {
        let resultValid = validationResult(request)
        if (resultValid.isEmpty()) {
            request.url = "/rooms/:idRoom/profiles/:idProfile"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                result.send(authorization)
            } else {
                result.send(await core.controller.room.deleteRoomProfile(
                    request.params.idRoom,
                    request.params.idProfile
                ))
            }
        } else {
            result.send(new Result(Package.name, true, resultValid.array({ onlyFirstError: true }).pop().msg))
        }
    })

}