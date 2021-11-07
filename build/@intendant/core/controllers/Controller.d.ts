import Connector from '@intendant/connector'
import Core from '../core'

declare class Controller {
    constructor(core: Core);

    core: Core;
    sqlRoutine: Connector;
    sqlRoutineEffect: Connector;
    sqlRoutineEffectArgument: Connector;
    sqlRoutineTrigger: Connector;
    sqlRoutineTriggerArgument: Connector;

    sqlUser: Connector;
    sqlClient: Connector;
    sqlProfile: Connector;
    sqlAuthorization: Connector;
    sqlAuthorizationProfile: Connector;

    sqlSmartobject: Connector;
    sqlSmartobjectStatus: Connector;
    sqlSmartobjectArgument: Connector;
    sqlSmartobjectProfile: Connector;

    sqlStorage: Connector;
    sqlWidget: Connector;
    sqlWidgetContent: Connector;
    sqlWidgetSource: Connector;
    sqlWidgetContentType: Connector;
    sqlWidgetSourceArgument: Connector;

    sqlEspace: Connector;
    sqlProcess: Connector;
    sqlProcessActionArgument: Connector;
    sqlProcessProfile: Connector;
    sqlProcessInput: Connector;
    sqlCache: Connector;
}

export default Controller



