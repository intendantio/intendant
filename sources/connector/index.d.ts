import Result from '../utils/Result'

declare class Connector {

    constructor(name: String);

    private check(exec: String): Object
    private getWhere(fields: Object): Object
    private getSet(fields: Object): Object

    public getOne(id: Number): Promise<Result>
    public getgetOneByFieldOne(wheres: Object): Promise<Result>
    public getAllByField(wheres: Object): Promise<Result>
    public updateAll(sets: Object, wheres: Object): Promise<Result>
    public getAll(): Promise<Result>
    public deleteOne(id: Number): Promise<Result>
    public deleteAllByField(fields: Object): Promise<Result>
    public truncate(): Promise<Result>
    public insert(fields: Object): Promise<Result>
    public execute(request: String, options: Object): Promise<Result>

}

export default Connector
