export default (app, core) => {

    app.get('/api/authorizations', async (request, res) => {
        request.url = '/authorizations'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.authentification.getAll())
        }
    })

}