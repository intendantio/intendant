import Package from '../package.json'
import Connector from '../connector'

import StackTrace from "../utils/StackTrace"
import Tracing from "../utils/Tracing"
import Result from "../utils/Result"

class Controller {
    constructor() {
        try {

            this.sqlAutomation = new Connector("automation")
            this.sqlAutomationTrigger = new Connector("automation_trigger")
            this.sqlAutomationAction = new Connector("automation_action")
            this.sqlAutomationActionArgument = new Connector("automation_action_argument")
            
            this.sqlUser = new Connector("user")
            this.sqlUserHistory = new Connector("user_history")

            this.sqlClient = new Connector("client")
            this.sqlProfile = new Connector("profile")
            this.sqlAuthorization = new Connector("authorization")

            this.sqlSmartobject = new Connector("smartobject")
            this.sqlSmartobjectArgument = new Connector("smartobject_argument")
            this.sqlSmartobjectHistory = new Connector("smartobject_history")
            
            this.sqlStorage = new Connector("storage")

            this.sqlProcess = new Connector("process")

            this.sqlRoom = new Connector("room")
            this.sqlRoomProfile = new Connector("room_profile")

            this.sqlCache = new Connector("cache")

            this.sqlRapport = new Connector("rapport")
            this.sqlRapportData = new Connector("rapport_data")
            this.sqlRapportArgument = new Connector("rapport_argument")

            this.sqlPosition = new Connector("position")
            
            this.sqlSingleCode = new Connector("single_code")
            
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when construct an controller")
            return new Result(Package.name, true, "Error occurred when construct an controller")
        }
    }

    addController(entity) {
        let className = entity.constructor.name
        let lowerClassName = className.toLowerCase()
        this[lowerClassName + "Controller"] = entity
    }

    addManager(entity) {
        let className = entity.constructor.name
        let lowerClassName = className.toLowerCase()
        this[lowerClassName + "Manager"] = entity
    }
}

export default Controller