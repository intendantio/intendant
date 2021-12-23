import Package from '../package.json'
import Connector from '../connector'
import Tracing from "../utils/Tracing"

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
            this.sqlWidgetContent = new Connector("widget_content")
            this.sqlWidgetSource = new Connector("widget_source")
            this.sqlWidgetContentType = new Connector("widget_content_type")
            this.sqlWidgetSourceArgument = new Connector("widget_source_argument")

            this.sqlEspace = new Connector("espace")
            this.sqlProcess = new Connector("process")
            this.sqlProcessAction = new Connector("process_action")
            this.sqlProcessActionArgument = new Connector("process_action_argument")
            this.sqlProcessProfile = new Connector("process_profile")
            this.sqlProcessInput = new Connector("process_input")

            this.sqlCache = new Connector("cache")
            
        } catch (error) {
            Tracing.error(Package.name,"Controller : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }
}

export default Controller