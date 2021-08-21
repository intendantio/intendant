export default (app, core) => {
    //Get all routine
    app.get('/api/routines', async (request, res) => {
        request.url = '/routines'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.routine.getAll())
        }
    })

    //Get one routine
    app.get('/api/routines/:idRoutine', async (request, res) => {
        request.url = '/routines/:idRoutine'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.routine.getOne(
                request.params.idRoutine
            ))
        }
    })

    //Insert one routine
    app.post('/api/routines', async (request, res) => {
        request.url = '/routines'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.routine.insert(
                request.body.name, 
                request.body.icon, 
                request.body.watch, 
                request.body.triggers, 
                request.body.effects
            ))
        }
    })

    //Delete one widget
    app.delete('/api/routines/:idRoutine', async (request, res) => {
        request.url = '/routines/:idRoutine'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.routine.delete(
                request.params.idRoutine
            ))
        }
    })

    //Update one routine
    app.put('/api/routines/:idRoutine', async (request, res) => {
        request.url = '/routines/:idRoutine'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.routine.update(
                request.params.idRoutine,
                request.body.name, 
                request.body.icon, 
                request.body.watch, 
                request.body.triggers, 
                request.body.effects
            ))
        }
    })

    //Update status
    app.put('/api/routines/:idRoutine/status', async (request, res) => {
        request.url = '/routines/:idRoutine/status'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.routine.updateStatus(request.params.idRoutine, request.body.status))
        }
    })

    //Duplicate
    app.put('/api/routines/:idRoutine/duplicate', async (request, res) => {
        request.url = '/routines/:idRoutine/duplicate'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.routine.duplicate(request.params.idRoutine))
        }
    })
}