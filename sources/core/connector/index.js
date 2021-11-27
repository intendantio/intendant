import Connection from './lib/Connection'
import Package from '../package.json'

class SQLite {

    constructor(configuration, core, name) {
        try {
            this._core = core
            this._name = name
            this._configuration = configuration
            this._connector = Connection.getInstance(configuration)
        } catch (error) {
            this._core.logger.error(Package.name, "Error occured in " + this._name + " table")
            throw error
        }
    }


    check(exec) {
        if(this._connector.open == false) {
            this._core.logger.error(Package.name, "Unable to connect at database " + this._configuration.connector.database + " " + this._name)
            this._core.logger.error(Package.name, "Please check the configuration of the connector and the status of the database")
            process.exit(0)
        } else if(this._connector.inTransaction) {
            setTimeout(() => {
                this.check(exec)
            },2000)
        }
    }

    async getOne(id) {
        this.check()
        if (typeof id == 'string' || typeof id == 'number') {
            try {
                let result = await this._connector.prepare("SELECT * FROM " + this._name + " WHERE id=" + id).all()
                return {
                    package: Package.name,
                    error: false,
                    data: result.length == 1 ? result[0] : false,
                    message: ""
                }
            } catch (error) {
                let message = this._name + " catch an error : " + JSON.stringify(error.toString())
                this._core.logger.error(Package.name, message)
                return {
                    package: Package.name,
                    error: true,
                    message: message
                }
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async getOneByField(wheres) {
        this.check("getOneByField")
        if (typeof wheres == 'object') {
            try {
                let result = await this._connector.prepare("SELECT * FROM " + this._name + this.getWhere(wheres)).all()
                return {
                    package: Package.name,
                    error: false,
                    data: result.length == 1 ? result[0] : false,
                    message: ""
                }
            } catch (error) {
                let message = this._name + " catch an error : " + JSON.stringify(error.toString())
                this._core.logger.error(Package.name, message)
                return {
                    package: Package.name,
                    error: true,
                    message: message
                }
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async getAllByField(wheres) {
        this.check("getAllByField")
        if (typeof wheres == 'object') {
            try {
                let result = await this._connector.prepare("SELECT * FROM " + this._name + this.getWhere(wheres)).all()
                return {
                    package: Package.name,
                    data: result,
                    error: false,
                    message: ""
                }
            } catch (error) {
                let message = this._name + " catch an error : " + JSON.stringify(error.toString())
                this._core.logger.error(Package.name, message)
                return {
                    package: Package.name,
                    error: true,
                    message: message
                }
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async getAll() {
        this.check("getAll")
        try {
            let result = await this._connector.prepare("SELECT * FROM " + this._name).all()
            return {
                package: Package.name,
                data: result,
                error: false,
                message: ""
            }
        } catch (error) {
            let message = this._name + " catch an error : " + JSON.stringify(error.toString())
            this._core.logger.error(Package.name, message)
            return {
                package: Package.name,
                error: true,
                message: message
            }
        }
    }

    async deleteOne(id) {
        this.check("deleteOne")
        if (typeof id == 'string' || typeof id == 'number') {
            try {
                await this._connector.prepare("DELETE FROM " + this._name + " WHERE id=" + id).run()
                return {
                    package: Package.name,
                    error: false,
                    message: ""
                }
            } catch (error) {
                let message = this._name + " catch an error : " + JSON.stringify(error.toString())
                this._core.logger.error(Package.name, message)
                return {
                    package: Package.name,
                    error: true,
                    message: message
                }
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async deleteAllByField(fields) {
        this.check("deleteAllByField")
        if (typeof fields == 'object') {
            try {
                await this._connector.prepare("DELETE FROM " + this._name + this.getWhere(fields)).run()
                return {
                    package: Package.name,
                    error: false,
                    message: ""
                }
            } catch (error) {
                let message = this._name + " catch an error : " + JSON.stringify(error.toString())
                this._core.logger.error(Package.name, message)
                return {
                    package: Package.name,
                    error: true,
                    message: message
                }
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async updateAll(sets, wheres = {}) {
        this.check("updateAll")
        if (typeof wheres == 'object' && typeof sets == 'object') {
            try {
                await this._connector.prepare("UPDATE " + this._name + this.getSet(sets) + this.getWhere(wheres)).run()
                return {
                    package: Package.name,
                    error: false,
                    message: ""
                }
            } catch (error) {
                let message = this._name + " catch an error : " + JSON.stringify(error.toString())
                this._core.logger.error(Package.name, message)
                return {
                    package: Package.name,
                    error: true,
                    message: message
                }
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async truncate() {
        this.check("truncate")
        try {
            await this._connector.prepare("DELETE FROM " + this._name).run()
            return {
                package: Package.name,
                error: false,
                message: ""
            }
        } catch (error) {
            let message = this._name + " catch an error : " + JSON.stringify(error.toString())
            this._core.logger.error(Package.name, message)
            return {
                package: Package.name,
                error: true,
                message: message
            }
        }
    }

    async insert(fields) {
        this.check("insert")
        if (typeof fields == 'object') {
            try {
                let keys = "("
                let values = "("
                for (let keyField in fields) {
                    let field = fields[keyField]
                    keys = keys + "`" + keyField + "`,"
                    if (field == null) {
                        values = values + "NULL,"
                    } else if (typeof field == 'number') {
                        values = values + "" + field + ","
                    } else if (typeof field == 'boolean') {
                        values = values + "'" + field + "',"
                    } else if (field.slice(0, 11) == "DATE:CUSTOM") {
                        values = values +  "datetime('now', '+" + field.slice(11) + " second'),"
                    } else if (field == "DATE:NOW") {
                        values = values + "datetime('now'),"
                    } else if (typeof field == 'string') {
                        values = values + "'" + field.replace(/'/g, "''") + "',"
                    }
                }
                values = values.slice(0, -1)
                values = values + ")"
                keys = keys.slice(0, -1)
                keys = keys + ")"
                let result = await this._connector.prepare("INSERT INTO " + this._name + " " + keys + " VALUES " + values).run()
                result = { insertId: result.lastInsertRowid } 
                return {
                    package: Package.name,
                    error: false,
                    data: result,
                    message: ""
                }
            } catch (error) {
                let message = this._name + " catch an error : " + JSON.stringify(error.toString())
                this._core.logger.error(Package.name, message)
                return {
                    package: Package.name,
                    error: true,
                    message: message
                }
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async execute(request) {
        this.check("execute")
        if (typeof request == 'string') {
            try {
                request = request.replace("DATE:NOW","date('now')")
                let result = await this._connector.prepare(request).run()
                return {
                    package: Package.name,
                    error: false,
                    data: result,
                    message: ""
                }
            } catch (error) {
                let message = this._name + " catch an error : " + JSON.stringify(error.toString())
                this._core.logger.error(Package.name, message)
                return {
                    error: true,
                    package: Package.name,
                    message: message
                }
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    getWhere(fields) {
        let total = 0
        let statment = " WHERE "
        for (let field in fields) {
            let value = fields[field];
            
            if (total > 0) {
                statment = statment + " AND "
            }
            if(typeof value == "object") {
                if (value.value == "DATE:NOW") {
                    statment = statment + field + value.statement  +  "date('now')"
                }  else {
                    statment = statment + field + value.statement  +  "'" + value.value + "'"
                }
            } else {
                statment = statment + field + "='" + value + "'"
            }
            total = total + 1
        }
        if (total === 0) {
            return ""
        }
        return statment
    }

    getSet(fields) {
        let total = 0
        let statment = " SET "
        for (let field in fields) {
            let value = fields[field];
            if (total > 0) {
                statment = statment + " , "
            }
            if (value == null) {
                statment = statment + field + "=NULL,"
            } else if (typeof value == 'number') {
                statment = statment + field + "=" + value + ","
            } else if (value.slice(0, 11) == "DATE:CUSTOM") {
                statment = statment + field + "=date('now',+" + field.slice(11) + " second),"
            } else if (value == "DATE:NOW") {
                statment = statment + field + "=date('now'),"
            } else if (typeof value == 'string') {
                statment = statment + field + "='" + value.replace(/'/g, "''") + "',"
            }
            total = total + 1
        }
        statment = statment.slice(0, -1)
        if (total === 0) {
            return ""
        }
        return statment
    }

}

export default SQLite
