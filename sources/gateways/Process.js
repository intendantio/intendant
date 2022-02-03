export default (app, core) => {



    //Get all process
    app.get("/api/processes", async (request, res) => {
        request.url = '/processes'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.getAll())
        }
    })

    //Insert new porcess
    app.post("/api/processes", async (request, res) => {
        request.url = "/processes"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.insert(request.body))
        }
    })

    //Get one process
    app.get("/api/processes/:idProcess", async (request, res) => {
        request.url = '/espace/:id/processes/:idProcess'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.getOne(request.params.idProcess))
        }
    })

    //Delete process
    app.delete("/api/processes/:idProcess", async (request, res) => {
        request.url = "/processes/:idProcess"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.delete(request.params.idProcess))
        }
    })

    // Execute action
    app.post("/api/processes/:id/execute", async (request, res) => {
        request.url = '/processes/:idprocess/execute'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.executeAction(request.params.id, authorization.profile, request.body.inputs))
        }
    })

    // Insert process profiles
    app.post("/api/processes/:idProcess/profiles", async (request, res) => {
        request.url = "/processes/:idProcess/profiles"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.insertProcessProfile(
                request.params.idProcess,
                request.body.idProfile
            ))
        }
    })

    // Delete process profiles
    app.delete("/api/processes/:idProcess/profiles/:idProfile", async (request, res) => {
        request.url = "/processes/:idProcess/profiles/:idProfile"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.deleteProcessProfile(
                request.params.idProcess,
                request.params.idProfile
            ))
        }
    })




}