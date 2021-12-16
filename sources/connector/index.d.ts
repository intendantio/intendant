declare class Connector {
    constructor(name: String);

    private check(exec: String);
    private getWhere(fields: Object);
    private getSet(fields: Object);

    public async getOne(id: Number);
    public async getgetOneByFieldOne(wheres: Object);
    public async getAllByField(wheres: Object);
    public async updateAll(sets: Object,wheres: Object);
    public async getAll();
    public async deleteOne(id: Number);
    public async deleteAllByField(fields: Object);
    public async truncate();
    public async insert(fields: Object);
    
}

export default Connector
