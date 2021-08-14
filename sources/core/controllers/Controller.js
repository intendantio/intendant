import Package from '../package.json'

class Controller {
    constructor(core) {
        try {
            this.core = core

            this.sqlRoutine = new this.core.connector(this.core.configuration, core, "routine")
            this.sqlRoutineEffect = new this.core.connector(this.core.configuration, core, "routine_effect")
            this.sqlRoutineEffectArgument = new this.core.connector(this.core.configuration, core, "routine_effect_argument")
            this.sqlRoutineTrigger = new this.core.connector(this.core.configuration, core, "routine_trigger")
            this.sqlRoutineTriggerArgument = new this.core.connector(this.core.configuration, core, "routine_trigger_argument")
            
            this.sqlUser = new this.core.connector(this.core.configuration, core, "user")
            this.sqlClient = new this.core.connector(this.core.configuration, core, "client")
            this.sqlProfile = new this.core.connector(this.core.configuration, core, "profile")
            this.sqlAuthorization = new this.core.connector(this.core.configuration, core, "authorization")
            this.sqlAuthorizationProfile = new this.core.connector(this.core.configuration, core, "authorization_profile")

            this.sqlSmartobject = new this.core.connector(this.core.configuration, core, "smartobject")
            this.sqlSmartobjectStatus = new this.core.connector(this.core.configuration, core, "smartobject_status")
            this.sqlSmartobjectArgument = new this.core.connector(this.core.configuration, core, "smartobject_argument")
            this.sqlSmartobjectProfile = new this.core.connector(this.core.configuration, core, "smartobject_profile")
            
            this.sqlStorage = new this.core.connector(this.core.configuration, core, "storage")
            
            this.sqlWidget = new this.core.connector(this.core.configuration, core, "widget")
            this.sqlWidgetContent = new this.core.connector(this.core.configuration, core, "widget_content")
            this.sqlWidgetSource = new this.core.connector(this.core.configuration, core, "widget_source")
            this.sqlWidgetContentType = new this.core.connector(this.core.configuration, core, "widget_content_type")
            this.sqlWidgetSourceArgument = new this.core.connector(this.core.configuration, core, "widget_source_argument")

            this.sqlEspace = new this.core.connector(this.core.configuration, core, "espace")
            this.sqlProcess = new this.core.connector(this.core.configuration, core, "process")
            this.sqlProcessAction = new this.core.connector(this.core.configuration, core, "process_action")
            this.sqlProcessActionArgument = new this.core.connector(this.core.configuration, core, "process_action_argument")
            this.sqlProcessProfile = new this.core.connector(this.core.configuration, core, "process_profile")
            this.sqlProcessInput = new this.core.connector(this.core.configuration, core, "process_input")

            this.sqlCache = new this.core.connector(this.core.configuration, core, "cache")
        } catch (error) {
            
        }
        
    }
}

export default Controller