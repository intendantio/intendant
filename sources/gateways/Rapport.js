export default (app, core) => {

    //Get all rapports
    app.get("/api/rapports", async (request, res) => {
        request.url = '/rapports'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.rapport.getAll())
        }
    })

    //Get one rapport
    app.get("/api/rapports/:idRapport", async (request, res) => {
        request.url = '/rapports/:idRaport'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.rapport.getOne(request.params.idRapport))
        }
    })

    //Get all data
    app.get("/api/rapports/:idRapport/data/:start/:end", async (request, res) => {
        request.url = '/rapports/:idRapport'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.rapport.getData(request.params.idRapport,request.params.start,request.params.end))
        }
    })

    //Insert new rapport
    app.post("/api/rapports", async (request, res) => {
        request.url = "/rapports"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.rapport.insert(
                request.body.type,
                request.body.chart,
                request.body.object,
                request.body.reference,
                request.body.interval,
                request.body.settings,
            ))
        }
    })

    //Delete rapport
    app.delete("/api/rapports/:idRapport", async (request, res) => {
        request.url = "/rapports/:idRapport"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.rapport.delete(request.params.idRapport))
        }
    })

    //Truncate data rapport
    app.patch("/api/rapports/:idRapport", async (request, res) => {
        request.url = "/rapports/:idRapport"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.rapport.truncate(request.params.idRapport))
        }
    })

    //Insert new rapport data
    app.post("/api/rapports/:idRapport/data", async (request, res) => {
        request.url = "/rapports/:idRapport/data"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.rapport.insertData(
                request.params.idRapport,
                request.body.value
            ))
        }
    })


}