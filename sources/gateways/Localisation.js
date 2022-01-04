export default (app, core) => {

    //Get all localisations
    app.get("/api/localisations", async (request, res) => {
        request.url = "/localisations"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.localisation.getAll())
        }
    })

    //Get one localisations
    app.get("/api/localisations/:idLocalisation", async (request, res) => {
        request.url = "/localisations/:idLocalisation"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.localisation.getOne(request.params.idLocalisation))
        }
    })

    //Insert localisations

    app.post("/api/localisations", async (request, res) => {
        request.url = "/localisations"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.localisation.insert(request.body.name))
        }
    })


    // Execute action by localisation
    app.post("/api/localisations/:idLocalisation/actions/:idAction", async (request, res) => {
        request.url = "/localisations/:idLocalisation/actions/:idAction"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.localisation.executeAction(
                request.params.idLocalisation,
                request.params.idAction,
                request.body.settings
            ))
        }
    })


    //Delete localisations

    app.delete("/api/localisations/:idLocalisation", async (request, res) => {
        request.url = "/localisations/:idLocalisation"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.localisation.delete(request.params.idLocalisation))
        }
    })

    // Insert localisation profiles
    app.post("/api/localisations/:idLocalisation/profiles", async (request, res) => {
        request.url = "/localisations/:idLocalisation/profiles"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.localisation.insertLocalisationProfile(
                request.params.idLocalisation,
                request.body.idProfile
            ))
        }
    })

    // Delete localisation profiles
    app.delete("/api/localisations/:idLocalisation/profiles/:idProfile", async (request, res) => {
        request.url = "/localisations/:idLocalisation/profiles/:idProfile"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.localisation.deleteLocalisationProfile(
                request.params.idLocalisation,
                request.params.idProfile
            ))
        }
    })

}