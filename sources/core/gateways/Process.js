export default (app, core) => {

    //Get all espace
    app.get("/api/espaces", async (request, res) => {
        request.url = '/espaces'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.espace.getAll())
        }
    })

    //Get all process
    app.get("/api/process", async (request, res) => {
        request.url = '/process'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.getAll())
        }
    })

    //Insert new porcess
    app.post("/api/process", async (request, res) => {
        request.url = "/process"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.insert(
                request.body.reference,
                request.body.name,
                request.body.nameEnable,
                request.body.nameDisable,
                request.body.description, 
                request.body.espace, 
                request.body.icon, 
                request.body.mode, 
                request.body.sources, 
                request.body.inputs
            ))
        }
    })

    //Get one process
    app.get("/api/process/:idProcess", async (request, res) => {
        request.url = '/espace/:id/process/:idProcess'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.getOne(request.params.idProcess))
        }
    })

    //Delete process
    app.delete("/api/process/:idProcess", async (request, res) => {
        request.url = "/process/:idProcess"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.delete(request.params.idProcess))
        }
    })

    //Insert new process action
    app.post("/api/process/:idProcess/actions", async (request, res) => {
        request.url = '/process/:idProcess/actions'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.insertAction(request.params.idProcess, request.body.source, request.body.action, request.body.enable, request.body.arguments))
        }
    })

    //Delete process action
    app.delete("/api/process/:idProcess/actions/:idAction", async (request, res) => {
        request.url = '/process/:idProcess/actions/:idAction'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.deleteAction(request.params.idProcess, request.params.idAction))
        }
    })
    
    //Insert process inputs
    app.post('/api/process/:idProcess/inputs', async (request, res) => {
        request.url = '/process/:idProcess/inputs'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.insertInput(request.params.idProcess, request.body.reference, request.body.name, request.body.type, request.body.enable))
        }
    })

    //Delete process inputs
    app.delete('/api/process/:idProcess/inputs/:idInput', async (request, res) => {
        request.url = '/process/:idProcess/inputs/:idInput'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.deleteInput(  request.params.idProcess, request.params.idInput ))
        }
    })

    // Execute action
    app.post("/api/process/:id/execute", async (request, res) => {
        request.url = '/process/:idprocess/execute'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.process.executeAction(request.params.id, authorization.profile, request.body.inputs))
        }
    })

    // Insert process profiles
    app.post("/api/process/:idProcess/profiles", async (request, res) => {
        request.url = "/process/:idProcess/profiles"
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
    app.delete("/api/process/:idProcess/profiles/:idProfile", async (request, res) => {
        request.url = "/process/:idProcess/profiles/:idProfile"
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