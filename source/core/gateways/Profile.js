export default (app, core) => {

    app.get('/api/profiles/:idProfile', async (request, res) => {
        request.url = '/profiles/:idProfile'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.profile.getOne(request.params.idProfile))
        }
    })

    app.get('/api/profiles', async (request, res) => {
        request.url = '/profiles'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.profile.getAll())
        }
    })

    app.get('/api/profiles/:idProfile/authorizations', async (request, res) => {
        request.url = '/profiles/:idProfile/authorizations'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.authentification.getAllAuthorizationByProfile(request.params.idProfile))
        }
    })

    app.post('/api/profiles/:idProfile/authorizations', async (request, res) => {
        request.url = '/profiles/:idProfile/authorizations'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.authentification.updateAuthorizationByProfile(request.params.idProfile, request.body.authorization, request.body.secure))
        }
    })
    
}