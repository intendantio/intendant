import Package from '../package.json'

export default (app, core) => {
    app.get("/api/ping", async (request, res) => {
        request.url = '/ping'
        let result = await core.controller.user.getStarted()
        if (result.error) {
            res.send(result.error)
        } else {
            res.send({
                version: Package.version,
                getStarted: result.getStarted,
                error: false,
                message: "pong",
                code: "ok"
            })
        }
    })
}