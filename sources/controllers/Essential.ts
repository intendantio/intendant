import Controller from "./Controller"
import Result from "../utils/Result"
import Package from "../package.json"

class Essential extends Controller {

    async restart(settings = {}) {
        process.exit()
    }

    async executeAction(idAction, settings = {}) {
        if (this[idAction]) {
            return this[idAction](settings)
        } else {
            return new Result(Package.name, true, "Invalid essential action")
        }
    }

    async getAll() {
        return new Result(Package.name, false, "", [
            {
                id: "restart",
                name: "Restart intendant",
                description: "Restart intendant server",
                settings: []
            }
        ])
    }

}

export default Essential