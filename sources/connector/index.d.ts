declare class Connector {
    constructor(configuration: Object, core: any, name: String);
    private getWhere(fields: Object);
    private getSet(fields: Object);
}

export default Connector
