export default (app, core) => {

    app.post('/api/authentification', async (request, res) => {
        request.url = '/authentification'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.authentification.getToken(request.body.login,request.body.password))
        }
    })
    
}