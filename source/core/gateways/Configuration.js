export default (app, core) => {

    //Get all smartobject configuration
    app.get('/api/configurations/smartobject', async (request, res) => {
        request.url = '/configurations/smartobject'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.manager.smartobject.getAll())
        }
    })

    //Get all module configuration
    app.get("/api/configurations/module", async (request, res) => {
        request.url = '/configurations/module'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.manager.module.getAll())
        }
    })

    //Get all widget configuration
    app.get("/api/configurations/widget", async (request, res) => {
        request.url = '/configurations/widget'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.widget.getConfiguration())
        }
    })

    //Get all routine configuration 
    app.get('/api/configurations/routine', async (request, res) => {
        request.url = '/configurations/routine'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            res.send(await core.controller.routine.getConfiguration())
        }
    })

}