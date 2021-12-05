import Package from '../package.json'
import Connector from '../connector'

class Controller {
    constructor(core) {
        try {
            this.core = core

            this.sqlRoutine = new Connector(this.core.configuration, core, "routine")
            this.sqlRoutineEffect = new Connector(this.core.configuration, core, "routine_effect")
            this.sqlRoutineEffectArgument = new Connector(this.core.configuration, core, "routine_effect_argument")
            this.sqlRoutineTrigger = new Connector(this.core.configuration, core, "routine_trigger")
            this.sqlRoutineTriggerArgument = new Connector(this.core.configuration, core, "routine_trigger_argument")
            
            this.sqlUser = new Connector(this.core.configuration, core, "user")
            this.sqlClient = new Connector(this.core.configuration, core, "client")
            this.sqlProfile = new Connector(this.core.configuration, core, "profile")
            this.sqlAuthorization = new Connector(this.core.configuration, core, "authorization")
            this.sqlAuthorizationProfile = new Connector(this.core.configuration, core, "authorization_profile")

            this.sqlSmartobject = new Connector(this.core.configuration, core, "smartobject")
            this.sqlSmartobjectStatus = new Connector(this.core.configuration, core, "smartobject_status")
            this.sqlSmartobjectArgument = new Connector(this.core.configuration, core, "smartobject_argument")
            this.sqlSmartobjectProfile = new Connector(this.core.configuration, core, "smartobject_profile")
            
            this.sqlStorage = new Connector(this.core.configuration, core, "storage")
            
            this.sqlWidget = new Connector(this.core.configuration, core, "widget")
            this.sqlWidgetContent = new Connector(this.core.configuration, core, "widget_content")
            this.sqlWidgetSource = new Connector(this.core.configuration, core, "widget_source")
            this.sqlWidgetContentType = new Connector(this.core.configuration, core, "widget_content_type")
            this.sqlWidgetSourceArgument = new Connector(this.core.configuration, core, "widget_source_argument")

            this.sqlEspace = new Connector(this.core.configuration, core, "espace")
            this.sqlProcess = new Connector(this.core.configuration, core, "process")
            this.sqlProcessAction = new Connector(this.core.configuration, core, "process_action")
            this.sqlProcessActionArgument = new Connector(this.core.configuration, core, "process_action_argument")
            this.sqlProcessProfile = new Connector(this.core.configuration, core, "process_profile")
            this.sqlProcessInput = new Connector(this.core.configuration, core, "process_input")

            this.sqlCache = new Connector(this.core.configuration, core, "cache")
        } catch (error) {
            this.core.logger.error("Controller : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }
}

export default Controller