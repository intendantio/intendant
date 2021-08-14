export default (app, core) => {

    //Get all smartobject
    app.get('/api/smartobjects', async (request, res) => {
        request.url = '/smartobjects'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.smartobject.getAll())
        }
    })

    //Get one smartobject
    app.get('/api/smartobjects/:idSmartobject', async (request, res) => {
        request.url = '/smartobjects/:idSmartobject'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.smartobject.getOne(
                request.params.idSmartobject
            ))
        }
    })

    //Insert smartobject 
    app.post('/api/smartobjects', async (request, res) => {
        request.url = '/smartobjects'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.smartobject.insert(
                request.body.module,
                request.body.reference,
                request.body.settings
            ))
        }
    })

    // Delete smartobject
    app.delete('/api/smartobjects/:idSmartobject', async (request, res) => {
        request.url = '/smartobjects/:idSmartobject'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.smartobject.delete(
                request.params.idSmartobject
            ))
        }
    })

    //Insert smartobject settings
    app.post('/api/smartobjects/:idSmartobject/settings', async (request, res) => {
        request.url = '/smartobjects/:idSmartobject/settings'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.smartobject.insertSettings(
                request.params.idSmartobject,
                request.body.reference,
                request.body.value
            ))
        }
    })

    //Delete smartobject settings
    app.delete('/api/smartobjects/:idSmartobject/settings/:idSetting', async (request, res) => {
        request.url = '/smartobjects/:idSmartobject/settings/:idSetting'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.smartobject.deleteSettings(
                request.params.idSetting,
                request.params.idSmartobject
            ))
        }
    })

    // Execute one action 
    app.post('/api/smartobjects/:idSmartobject/actions/:idAction', async (request, res) => {
        request.url = '/smartobjects/:id/actions/:idAction'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.smartobject.executeAction(
                request.params.idSmartobject,
                request.params.idAction,
                authorization.profile,
                request.body.settings
            ))
        }
    })

    // Insert smartobject profiles
    app.post("/api/smartobjects/:idSmartobject/profiles", async (request, res) => {
        request.url = "/api/smartobjects/:idSmartobject/profiles"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.smartobject.insertSmartobjectProfile(
                request.params.idSmartobject,
                request.body.idProfile
            ))
        }
    })

    // Delete smartobject profiles
    app.delete("/api/smartobjects/:idSmartobject/profiles/:idProfile", async (request, res) => {
            request.url = "/api/smartobjects/:idSmartobject/profiles/:idProfile"
            let authorization = await core.controller.authentification.checkAuthorization(request)
            if (authorization.error) {
                res.send(authorization)
            } else {
                res.send(await core.controller.smartobject.deleteSmartobjectProfile(
                    request.params.idSmartobject,
                    request.params.idProfile
                ))
            }
    })

}