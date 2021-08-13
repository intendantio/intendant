export default (app, core) => {

    app.get('/api/users', async (request, res) => {
        request.url = '/users'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.user.getAll())
        }
    })

    app.post('/api/users', async (request, res) => {
        request.url = '/users'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.user.insert(
                request.body.login,
                request.body.password,
                request.body.profile
            ))
        }
    })

    app.put('/api/users/:idUser', async (request, res) => {
        request.url = '/users/:idUser'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.user.update(
                request.params.idUser, 
                request.body.login, 
                request.body.profile
            ))
        }
    })

    app.delete('/api/users/:idUser', async (request, res) => {
        request.url = '/users/:idUser'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.user.delete(
                request.params.idUser
            ))
        }
    })

    app.post('/api/users/:idUser/password', async (request, res) => {
        request.url = '/api/users/:idUser/password'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.user.updatePassword(
                request.params.idUser, 
                request.body.password
            ))
        }
    })
}