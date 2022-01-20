export default (app, core) => {
    
    app.get("/api/modules/configuration", async (request, res) => {
        request.url = '/modules/configuration'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(
                core.controller.module.getAllConfiguration(
                    core.controller.module.getByHash(
                        request.params.idModule
                    ).data
                )
            )
        }
    })

    app.get("/api/modules/:idModule/configuration", async (request, res) => {
        request.url = '/modules/:idModule/configuration'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(
                core.controller.module.getConfiguration(
                    core.controller.module.getByHash(
                        request.params.idModule
                    ).data
                )
            )
        }
    })

    app.get("/api/modules/:idModule/state", async (request, res) => {
        request.url = '/modules/:idModule/state'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(
                await core.controller.module.getState(
                    core.controller.module.getByHash(
                        request.params.idModule
                    ).data
                )
            )
        }
    })

    app.post("/api/modules/:idModule/datasources/:idDataSource", async (request, res) => {
        request.url = '/modules/:idModule/datasources/:idDataSource'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.module.getDataSourceValue(
                core.controller.module.getByHash(
                    request.params.idModule
                ).data,
                request.params.idDataSource, 
                request.body.settings
            ))
            
        }
    })

    app.post("/api/modules/:idModule/actions/:idAction", async (request, res) => {
        request.url = '/modules/:idModule/actions/:idAction'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.module.executeAction(
                core.controller.module.getByHash(request.params.idModule).data, 
                request.params.idAction, 
                request.body.settings
            ))
        }
    })
    
}