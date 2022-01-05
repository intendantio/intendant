import Controller from "./Controller"
import StackTrace from "../utils/StackTrace"
import Tracing from "../utils/Tracing"
import Result from "../utils/Result"
import Package from "../package.json"

class Essential extends Controller {

    constructor(controllers) {
        super()
        this.controllers = controllers
    }

    async sendNotification(settings = {}) {
        try {
            let result = await this.controllers.client.getAll()
            await this.controllers.notification.notify("Intendant", settings.message, result.data.map(data => data.token))
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when use essential sendNotification")
            return new Result(Package.name, true, "Error occurred use essential sendNotification")
        }
    }

    async enableRoutine(settings = {}) {
        try {
            await this.controllers.routine.updateStatus(settings.routine,1)
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when use essential enableRoutine")
            return new Result(Package.name, true, "Error occurred use when essential enableRoutine")
        }
    }

    async disableRoutine(settings = {}) {
        try {
            await this.controllers.routine.updateStatus(settings.routine,0)
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when use essential disableRoutine")
            return new Result(Package.name, true, "Error occurred when essential disableRoutine")
        }
    }

    async restart(settings = {}) {
        process.exit()
    }

    async executeAction(idAction,settings = {}) {
        if(this[idAction]) {
            return this[idAction](settings)
        } else {
            return new Result(Package.name, true, "Invalid essential action")
        }
    }

    async getAll() {
        return new Result(Package.name,false,"", [
            {
                id: "sendNotification",
                name: "Send notification",
                description: "Send at all device all notification",
                settings: [
                    {
                        id: "message",
                        type: "text",
                        default: ""
                    }
                ]
            },{
                id: "enableRoutine",
                name: "Enable routine",
                description: "Enable one routine",
                settings: [
                    {
                        id: "routine",
                        type: "number",
                        default: ""
                    }
                ]
            },{
                id: "disableRoutine",
                name: "Disable routine",
                description: "Disable one routine",
                settings: [
                    {
                        id: "routine",
                        type: "number",
                        default: ""
                    }
                ]
            },{
                id: "restart",
                name: "Restart intendant",
                description: "Restart intendant server",
                settings: []
            }
        ])
    }

}

export default Essential