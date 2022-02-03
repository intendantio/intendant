import Connector from '../connector'
import Core from '..'

declare class Controller {
    constructor();

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
    sqlWidgetArgument: Connector;

    sqlProcess: Connector;
    sqlProcessActionArgument: Connector;
    sqlProcessProfile: Connector;
    sqlProcessInput: Connector;
    sqlProcessInputOption: Connector;
    
    sqlCache: Connector;
    sqlRoom: Connector;
    sqlRoomProfile: Connector;

    
    sqlRapport: Connector;
    sqlRapportData: Connector;
    sqlRapportArgument: Connector;
}

export default Controller



