interface Result {
    package: String,
    error: Boolean,
    message: String,
    data?: Object
}

declare class Connector {
    
    constructor(name: String);

    private check(exec: String): Object;
    private getWhere(fields: Object): Object;
    private getSet(fields: Object): Object;

    public getOne(id: Number): Promise<Result>;
    public async getgetOneByFieldOne(wheres: Object): Promise<Result>;
    public async getAllByField(wheres: Object): Promise<Result>;
    public async updateAll(sets: Object,wheres: Object): Promise<Result>;
    public async getAll(): Promise<Result>;
    public async deleteOne(id: Number): Promise<Result>;
    public async deleteAllByField(fields: Object): Promise<Result>;
    public async truncate(): Promise<Result>;
    public async insert(fields: Object): Promise<Result>;
    
}

export default Connector
