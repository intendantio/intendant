import Connector from '@intendant/connector'

declare module '@intendant/sql-connector' {

    class SQL extends Connector {
        constructor(configuration: Object,core: any, name: String);
        private getWhere(fields: Object);
        private getSet(fields: Object);
    }

    export = SQL
}
