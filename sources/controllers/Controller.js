import Package from '../package.json'
import Connector from '../connector'
import Tracing from "../utils/Tracing"

class Controller {
    constructor(core) {
        try {
            this.core = core

            this.sqlRoutine = new Connector(core, "routine")
            this.sqlRoutineEffect = new Connector(core, "routine_effect")
            this.sqlRoutineEffectArgument = new Connector(core, "routine_effect_argument")
            this.sqlRoutineTrigger = new Connector(core, "routine_trigger")
            this.sqlRoutineTriggerArgument = new Connector(core, "routine_trigger_argument")
            
            this.sqlUser = new Connector(core, "user")
            this.sqlClient = new Connector(core, "client")
            this.sqlProfile = new Connector(core, "profile")
            this.sqlAuthorization = new Connector(core, "authorization")
            this.sqlAuthorizationProfile = new Connector(core, "authorization_profile")

            this.sqlSmartobject = new Connector(core, "smartobject")
            this.sqlSmartobjectStatus = new Connector(core, "smartobject_status")
            this.sqlSmartobjectArgument = new Connector(core, "smartobject_argument")
            this.sqlSmartobjectProfile = new Connector(core, "smartobject_profile")
            
            this.sqlStorage = new Connector(core, "storage")
            
            this.sqlWidget = new Connector(core, "widget")
            this.sqlWidgetContent = new Connector(core, "widget_content")
            this.sqlWidgetSource = new Connector(core, "widget_source")
            this.sqlWidgetContentType = new Connector(core, "widget_content_type")
            this.sqlWidgetSourceArgument = new Connector(core, "widget_source_argument")

            this.sqlEspace = new Connector(core, "espace")
            this.sqlProcess = new Connector(core, "process")
            this.sqlProcessAction = new Connector(core, "process_action")
            this.sqlProcessActionArgument = new Connector(core, "process_action_argument")
            this.sqlProcessProfile = new Connector(core, "process_profile")
            this.sqlProcessInput = new Connector(core, "process_input")

            this.sqlCache = new Connector(core, "cache")
            
        } catch (error) {
            Tracing.error("Controller : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }
}

export default Controller