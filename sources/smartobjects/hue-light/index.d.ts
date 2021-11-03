declare module '@intendant/hue-light-smartobject' {

    interface Configuration {
        name: String,
        icon: String,
        settings: Array<Settings>,
        actions: Array<Actions>
    }

    interface Settings {
        key: String,
        type: String,
        name: String
    }

    interface Actions {
        key: String,
        name: String,
        description: String,
        settings: Array<Object>
    }

    interface Settings {
        id: String,
        smartObjectId: String
    }

    interface Result {
        error: Boolean,
        package: Package.name,
        message: String
    }

    class SmartObject {
        constructor(settings: Settings, logger: Object, core: Object, configuration: Configuration);
        public action(action: String, settings: Object): Promise<Result>;
        public getActions(): Array<Actions>;
    }

    class HueSensor extends SmartObject {
        constructor(settings: Settings, logger: Object, core: Object);
        public __turnOn(settings: Object): Promise<Result>;
        public __turnOff(settings: Object): Promise<Result>;
        public __getState(settings: Object): Promise<Result>;
    }
    
    export = HueSensor
}
