export default (app, core) => {
    
    app.post("/api/modules/:idModule/actions/:idAction", async (request, res) => {
        request.url = '/modules/:idModule/actions/:idAction'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.manager.module.executeAction(
                core.manager.module.getByHash(request.params.idModule).data, 
                request.params.idAction, 
                request.body.settings
            ))
        }
    })
    
}