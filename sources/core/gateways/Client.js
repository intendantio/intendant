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
                return {
                    error: true,
                    package: Package.name,
                    message: 'Missing parametter'
                }
            }
        }
    })
    
}