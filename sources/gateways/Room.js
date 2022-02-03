export default (app, core) => {

    //Get all rooms
    app.get("/api/rooms", async (request, res) => {
        request.url = "/rooms"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.room.getAll())
        }
    })

    //Get one rooms
    app.get("/api/rooms/:idRoom", async (request, res) => {
        request.url = "/rooms/:idRoom"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.room.getOne(request.params.idRoom))
        }
    })

    //Insert rooms

    app.post("/api/rooms", async (request, res) => {
        request.url = "/rooms"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.room.insert(request.body))
        }
    })


    // Execute action by room
    app.post("/api/rooms/:idRoom/actions/:idAction", async (request, res) => {
        request.url = "/rooms/:idRoom/actions/:idAction"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.room.executeAction(
                request.params.idRoom,
                request.params.idAction,
                request.body.settings
            ))
        }
    })


    //Delete rooms

    app.delete("/api/rooms/:idRoom", async (request, res) => {
        request.url = "/rooms/:idRoom"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.room.delete(request.params.idRoom))
        }
    })

    // Insert room profiles
    app.post("/api/rooms/:idRoom/profiles", async (request, res) => {
        request.url = "/rooms/:idRoom/profiles"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.room.insertRoomProfile(
                request.params.idRoom,
                request.body.idProfile
            ))
        }
    })

    // Delete room profiles
    app.delete("/api/rooms/:idRoom/profiles/:idProfile", async (request, res) => {
        request.url = "/rooms/:idRoom/profiles/:idProfile"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.room.deleteRoomProfile(
                request.params.idRoom,
                request.params.idProfile
            ))
        }
    })

}