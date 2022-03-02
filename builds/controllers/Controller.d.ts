import Connector from '../connector'
import Core from '..'

declare class Controller {
    constructor();

    core: Core;
    sqlAutomation: Connector;
    sqlAutomationTrigger: Connector;
    sqlAutomationAction: Connector;
    sqlAutomationActionArgument: Connector;

    sqlUser: Connector;
    sqlUserHistory: Connector;

    
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
    sqlProcessAction: Connector;
    sqlProcessActionArgument: Connector;
    sqlProcessInput: Connector;
    sqlProcessInputOption: Connector;
    
    sqlCache: Connector;

    sqlRoom: Connector;
    sqlRoomProfile: Connector;

    
    sqlRapport: Connector;
    sqlRapportData: Connector;
    sqlRapportArgument: Connector;

    sqlSingleCode: Connector;

    public addController(entity: Controller)
    public addManager(entity: Object)

}

export default Controller



