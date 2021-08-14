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
            res.send(await core.controller.widget.insert(request.body.reference, request.body.icon, request.body.contents, request.body.sources))
        }
    })

    //Update widget
    app.put("/api/widgets/:idWidget", async (request, res) => {
        request.url = "/widgets/:idWidget"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.widget.update(request.params.idWidget, request.body.content))
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

    //Insert source in widget
    app.post("/api/widgets/:idWidget/sources", async (request, res) => {
        request.url = "/api/widgets/:idWidget/sources"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.widget.insertSource(request.params.idWidget, request.body.reference, request.body.source, request.body.action, request.body.arguments))
        }
    })

    //Delete source in widget
    app.delete("/api/widgets/:idWidget/sources/:idSource", async (request, res) => {
        request.url = "/api/widgets/:idWidget/sources/:idSource"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.widget.deleteSource(request.params.idWidget, request.params.idSource))
        }
    })

    //Insert content in widget
    app.post("/api/widgets/:idWidget/contents", async (request, res) => {
        request.url = "/api/widgets/:idWidget/content"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.widget.insertContent(request.params.idWidget, request.body.type, request.body.content))
        }
    })

    //Delete content in widget
    app.delete("/api/widgets/:idWidget/contents/:idContent", async (request, res) => {
        request.url = "/api/widgets/:idWidget/content/:idContent"
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.widget.deleteContent(request.params.idWidget, request.params.idContent))
        }
    })

}