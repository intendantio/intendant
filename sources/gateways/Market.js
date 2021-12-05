export default (app, core) => {

    app.post('/api/markets/install', async (request, res) => {
        request.url = '/markets/install'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.market.install(request.body.package))
        }
    })

    app.post('/api/markets/uninstall', async (request, res) => {
        request.url = '/markets/uninstall'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.market.uninstall(request.body.package))
        }
    })
    
}