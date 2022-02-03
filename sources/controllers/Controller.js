import Package from '../package.json'
import Connector from '../connector'

import StackTrace from "../utils/StackTrace"
import Tracing from "../utils/Tracing"
import Result from "../utils/Result"

class Controller {
    constructor() {
        try {
            this.sqlRoutine = new Connector("routine")
            this.sqlRoutineEffect = new Connector("routine_effect")
            this.sqlRoutineEffectArgument = new Connector("routine_effect_argument")
            this.sqlRoutineTrigger = new Connector("routine_trigger")
            this.sqlRoutineTriggerArgument = new Connector("routine_trigger_argument")
            
            this.sqlUser = new Connector("user")
            this.sqlClient = new Connector("client")
            this.sqlProfile = new Connector("profile")
            this.sqlAuthorization = new Connector("authorization")
            this.sqlAuthorizationProfile = new Connector("authorization_profile")

            this.sqlSmartobject = new Connector("smartobject")
            this.sqlSmartobjectStatus = new Connector("smartobject_status")
            this.sqlSmartobjectArgument = new Connector("smartobject_argument")
            this.sqlSmartobjectProfile = new Connector("smartobject_profile")
            
            this.sqlStorage = new Connector("storage")
            
            this.sqlWidget = new Connector("widget")
            this.sqlWidgetArgument = new Connector("widget_argument")

            this.sqlProcess = new Connector("process")
            this.sqlProcessAction = new Connector("process_action")
            this.sqlProcessActionArgument = new Connector("process_action_argument")
            this.sqlProcessProfile = new Connector("process_profile")
            this.sqlProcessInput = new Connector("process_input")
            this.sqlProcessInputOption = new Connector("process_input_option")

            this.sqlRoom = new Connector("room")
            this.sqlRoomProfile = new Connector("room_profile")

            this.sqlCache = new Connector("cache")

            this.sqlRapport = new Connector("rapport")
            this.sqlRapportData = new Connector("rapport_data")
            this.sqlRapportArgument = new Connector("rapport_argument")
            
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when construct an controller")
            return new Result(Package.name, true, "Error occurred when construct an controller")
        }
    }
}

export default Controller