import Smartobject from "../smartobject"

declare module NetatmoHomeCoach {

    interface Dashboard {
        temperature: Number,
        noise: Number,
        co2: Number,
        pressure: Number,
        humidity: Number
    }

    interface ResultDashboard extends Smartobject.Result {
        data: Dashboard
    }

    class NetatmoHomeCoach extends Smartobject.SmartObject {
        constructor(settings: Smartobject.Settings, logger: Object, core: Object);
        public request(settings: Object): Promise<Smartobject.Result>;
        public __dashboard(settings: Object): Promise<ResultDashboard>;
        public __place(settings: Object): Promise<Smartobject.Result>;
    }
    
}

export = NetatmoHomeCoach
