import Package from '../package.json'

export default (app, core) => {
    app.get("/api/essentials", async (request, res) => {
        request.url = '/essentials'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.essential.getAll())
        }
    })

    app.post("/api/essentials", async (request, res) => {
        request.url = '/essentials'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.essential.getAll())
        }
    })

    // Execute one action 
    app.post('/api/essentials/:idAction', async (request, res) => {
        request.url = '/essentials/:idAction'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.essential.executeAction(
                request.params.idAction,
                request.body.settings
            ))
        }
    })

}