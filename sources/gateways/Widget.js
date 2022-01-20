export default (app, core) => {

    //Get all widget
    app.get("/api/widgets", async (request, res) => {
        request.url = "/widgets"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.widget.getAll())
        }
    })

    //Get one widget
    app.get("/api/widgets/:idWidget", async (request, res) => {
        request.url = "/widgets/:idWidget"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.widget.getOne(request.params.idWidget))
        }
    })

    //Insert widget
    app.post("/api/widgets", async (request, res) => {
        request.url = "/widgets"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.widget.insert(request.body.reference, request.body.type, request.body.object, request.body.settings))
        }
    })

    //Delete widget
    app.delete("/api/widgets/:idWidget", async (request, res) => {
        request.url = "/widgets/:idWidget"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.widget.delete(request.params.idWidget))
        }
    })

   
}