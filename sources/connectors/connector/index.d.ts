declare module "@intendant/connector" {

    class Connector {
        constructor();
        public getOne(id: String): Promise<any>;
        public getOneByField(wheres: Object): Promise<any>;
        public getAllByField(wheres: Object): Promise<any>;
        public getAll(): Promise<any>;
        public delete(id: String): Promise<any>;
        public deleteAllByField(id: String): Promise<any>;
        public updateAll(fields: Object): Promise<any>;
        public truncate(sets: Object, wheres: Object): Promise<any>;
        public execute(request: String): Promise<any>;
        public insert(fields: Object): Promise<any>;
        public update(fields: Object): Promise<any>;
    }
    
    export default Connector

}
