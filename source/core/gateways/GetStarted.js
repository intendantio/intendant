export default (app, core) => {

    app.put("/api/getstarted", async (request, res) => {
        res.send(await core.controller.user.insertAdmin(request.body.password))
    })
    
}