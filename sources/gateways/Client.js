import Result from '../utils/Result'

export default (app, core) => {

    app.post("/api/client", async (request, res) => {
        request.url = '/client'
        let authorization = await core.controller.authentification.checkAuthorization(request)
        if (authorization.error) {
            res.send(authorization)
        } else {
            if (request.body) {
                res.send(await core.controller.client.insert({
                    name: request.body.name,
                    imei: request.body.imei,
                    token: request.body.token,
                    user: authorization.user
                }))
            } else {
                res.send(new Result(Package.name, true, "Missing parametter"))
            }
        }
    })

    app.get("/api/test", async (request, res) => {
        let r = await core.controller.client.getAll()
        let tokens = r.data.map(v => v.token)
        core.controller.notification.notify("Intendant", "notify - test", tokens)
        res.send({})
    })

}