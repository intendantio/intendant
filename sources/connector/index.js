import Connection from './lib/Connection'
import Package from '../package.json'
import Tracing from '../utils/Tracing'
import Result from '../utils/Result'
import Utils from '../utils/Utils'
import fetch from 'node-fetch'

class Connector {

    constructor(name) {
        try {
            this._name = name
            this._connector = Connection.getInstance()
        } catch (error) {
            Tracing.error(Package.name, "Error occured in " + this._name + " table")
            throw error
        }
    }

    

    static async migration(callback) {
        let connector = Connection.getInstance()
        let result = await fetch("https://raw.githubusercontent.com/intendantio/intendant/main/migration/index.json")
        let resultJSON = await result.json()
        let databaseVersion = await connector.prepare("SELECT * FROM metadata WHERE reference=@reference").get({ reference: "database" })
        if (databaseVersion.data == false) {
            Tracing.error(Package.name, "Error configuration in version is missing")
        } else {
            let last = resultJSON.last
            let current = parseInt(databaseVersion.value)
            let difference = last - current
            Tracing.verbose(Package.name, difference + " update(s) is available")
            if (difference == 0) {
                callback()
            } else if (difference > 0) {
                let next = (current + 1)
                let nextVersion = resultJSON.versions[next]

                if(Utils.isCompatible(Package.version,nextVersion.core)) {
                    let result = await fetch(nextVersion.url)
                    if (result.status == 200) {
                        let request = await result.text()
                        let requests = request.split(";")
                        for (let index = 0; index < requests.length; index++) {
                            let pRequest = requests[index].replace('\n', "")
                            if (pRequest != "") {
                                await connector.prepare(pRequest).run()
                            }
                        }
                        Tracing.verbose(Package.name, "Migration success version n°" + (current + 1))
                        await this.migration(callback)
                    }
                } else {
                    Tracing.warning(Package.name, "Core must have a minimum version of " + nextVersion.core + " to accept the update")
                    callback()
                }

            } else if (difference < 0) {
                Tracing.error(Package.name, "Invalid version")
            }
        }
    }

    check(exec) {
        if (this._connector.open == false) {
            Tracing.error(Package.name, "Unable to connect at database " + this._name)
            Tracing.error(Package.name, "Please check the configuration of the connector and the status of the database")
            process.exit(0)
        } else if (this._connector.inTransaction) {
            setTimeout(() => {
                Tracing.pure("In transaction")
                this.check(exec)
            }, 2000)
        }
    }

    async getOne(id) {
        this.check("getOne")
        try {
            let result = await this._connector.prepare("SELECT * FROM " + this._name + " WHERE id=@id").get({ id: id })
            return new Result(Package.name, false, "", result ? result : false)
        } catch (error) {
            Tracing.error(Package.name, "Catch Sqlite error on " + this._name + " : " + error.toString())
            return new Result(Package.name, true, "Error occurred when get one " + this._name)
        }
    }

    async getOneByField(wheres) {
        this.check("getOneByField")
        if (typeof wheres == 'object') {
            try {
                let result = await this._connector.prepare("SELECT * FROM " + this._name + this.getWhere(wheres)).get(wheres)
                return new Result(Package.name, false, "", result ? result : false)
            } catch (error) {
                Tracing.error(Package.name, "Catch Sqlite error on " + this._name + ":getOneByField : " + error.toString())
                return new Result(Package.name, true, "Error occurred when get one by field " + this._name)
            }
        } else {
            Tracing.warning("Wheres must be an object at " + this._name + ":getOneByField")
            return new Result(Package.name, true, "Wheres must be an object at " + this._name + ":getOneByField")
        }
    }

    async getAllByField(wheres = {}) {
        this.check("getAllByField")
        if (typeof wheres == 'object') {
            try {
                let result = await this._connector.prepare("SELECT * FROM " + this._name + this.getWhere(wheres)).all(wheres)
                return new Result(Package.name, false, "", result)
            } catch (error) {
                Tracing.error(Package.name, "Catch Sqlite error on " + this._name + ":getAllByField : " + error.toString())
                return new Result(Package.name, true, "Error occurred when get all by field " + this._name)
            }
        } else {
            Tracing.warning("Wheres must be an object at " + this._name + ":getAllByField")
            return new Result(Package.name, true, "Wheres must be an object at " + this._name + ":getAllByField")
        }
    }

    async count(wheres = {}) {
        this.check("count")
        if (typeof wheres == 'object') {
            try {
                let result = await this._connector.prepare("SELECT * FROM " + this._name + this.getWhere(wheres)).all(wheres)
                return new Result(Package.name, false, "", { count: result.length })
            } catch (error) {
                Tracing.error(Package.name, "Catch Sqlite error on " + this._name + ":count : " + error.toString())
                return new Result(Package.name, true, "Error occurred when get all by field " + this._name)
            }
        } else {
            Tracing.warning("Wheres must be an object at " + this._name + ":count")
            return new Result(Package.name, true, "Wheres must be an object at " + this._name + ":count")
        }
    }

    async getAll() {
        this.check("getAll")
        try {
            let result = await this._connector.prepare("SELECT * FROM " + this._name).all()
            return new Result(Package.name, false, "", result)
        } catch (error) {
            Tracing.error(Package.name, "Catch Sqlite error on " + this._name + ":getAll : " + error.toString())
            return new Result(Package.name, true, "Error occurred when get all " + this._name + ":getAll")
        }
    }

    async deleteOne(id) {
        this.check("deleteOne")
        try {
            await this._connector.prepare("DELETE FROM " + this._name + " WHERE id=@id").run({ id: id })
            return new Result(Package.name, false, "")
        } catch (error) {
            Tracing.error(Package.name, "Catch Sqlite error on " + this._name + ":deleteOne : " + error.toString())
            return new Result(Package.name, true, "Error occurred when delete on " + this._name + ":deleteOne")
        }
    }

    async deleteAllByField(wheres) {
        this.check("deleteAllByField")
        if (typeof wheres == 'object') {
            try {
                await this._connector.prepare("DELETE FROM " + this._name + this.getWhere(wheres)).run(wheres)
                return new Result(Package.name, false, "")
            } catch (error) {
                Tracing.error(Package.name, "Catch Sqlite error on " + this._name + ":deleteAllByField : " + error.toString())
                return new Result(Package.name, true, "Error occurred when delete all by field " + this._name)
            }
        } else {
            Tracing.warning("Wheres must be an object at " + this._name + ":deleteAllByField")
            return new Result(Package.name, true, "Wheres must be an object at " + this._name + ":deleteAllByField")
        }
    }

    async updateAll(sets = {}, wheres = {}) {
        this.check("updateAll")
        if (typeof wheres == 'object' && typeof sets == 'object') {
            try {
                let mergeCondition = {}
                for (let key in sets) {
                    let set = sets[key]
                    mergeCondition["set" + key] = set
                }
                for (let key in wheres) {
                    let where = wheres[key]
                    mergeCondition["where" + key] = where
                }
                await this._connector.prepare("UPDATE " + this._name + this.getSet(sets, "set") + this.getWhere(wheres, "where")).run(mergeCondition)
                return new Result(Package.name, false, "")
            } catch (error) {
                Tracing.error(Package.name, "Catch Sqlite error on " + this._name + ":updateAll : " + error.toString())
                return new Result(Package.name, true, "Error occurred when update all " + this._name)
            }
        } else {
            Tracing.warning("Wheres or Sets must be an object at " + this._name + ":updateAll")
            return new Result(Package.name, true, "Wheres or Sets must be an object at " + this._name + ":updateAll")
        }
    }

    async truncate() {
        this.check("truncate")
        try {
            await this._connector.prepare("DELETE FROM " + this._name).run()
            return new Result(Package.name, false, "")
        } catch (error) {
            Tracing.error(Package.name, "Catch Sqlite error on " + this._name + ":truncate : " + error.toString())
            return new Result(Package.name, true, "Error occurred when truncate " + this._name)
        }
    }

    async insert(sets) {
        this.check("insert")
        if (typeof sets == 'object') {
            try {
                let result = await this._connector.prepare("INSERT INTO " + this._name + " " + this.getInsert(sets)).run(sets)
                result = { insertId: result.lastInsertRowid }
                return new Result(Package.name, false, "", result)
            } catch (error) {
                Tracing.error(Package.name, "Catch Sqlite error on " + this._name + ":insert : " + error.toString())
                return new Result(Package.name, true, "Error occurred when insert " + this._name)
            }
        } else {
            Tracing.warning("Sets must be an object at " + this._name + ":insert")
            return new Result(Package.name, true, "Sets must be an object at " + this._name + ":insert")
        }
    }

    async execute(request, body, run = true) {
        this.check("execute")
        if (typeof request == 'string') {
            try {
                let result = false
                if (run) {
                    result = await this._connector.prepare(request).run(body)
                } else {
                    result = await this._connector.prepare(request).all(body)
                }
                return {
                    package: Package.name,
                    error: false,
                    data: result,
                    message: ""
                }
            } catch (error) {
                let message = this._name + " catch an error : " + error.toString()
                Tracing.error(Package.name, message)
                return {
                    error: true,
                    package: Package.name,
                    message: message
                }
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter " + this._name,
                error: true
            }
        }
    }

    getWhere(wheres, prefix = "") {
        let totalCondition = 0
        let statment = " WHERE "
        for (let key in wheres) {
            if (totalCondition > 0) {
                statment = statment + " AND "
            }
            statment = statment + key + "=@" + prefix + key
            totalCondition = totalCondition + 1
        }
        if (totalCondition === 0) {
            return ""
        }
        return statment
    }

    getSet(fields, prefix = "") {
        let totalSet = 0
        let statment = " SET "
        for (let key in fields) {
            if (totalSet > 0) {
                statment = statment + " , "
            }
            statment = statment + key + "=@" + prefix + key
            totalSet = totalSet + 1
        }
        if (totalSet === 0) {
            return ""
        }
        return statment
    }

    getInsert(fields) {
        let totalFields = 0
        let valueStatment = "("
        let keyStatment = "("
        for (let key in fields) {
            if (totalFields > 0) {
                valueStatment = valueStatment + ","
                keyStatment = keyStatment + ","
            }
            keyStatment = keyStatment + key
            valueStatment = valueStatment + "@" + key
            totalFields = totalFields + 1
        }
        valueStatment = valueStatment + ")"
        keyStatment = keyStatment + ")"
        return keyStatment + " VALUES " + valueStatment
    }
    
    
}

export default Connector
