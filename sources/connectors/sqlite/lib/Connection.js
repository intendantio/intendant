import betterSqlite3 from 'better-sqlite3'
import fs from 'fs'
import util from 'util'
let instance = null

class Connection {
    static getInstance(configuration) {
        if (instance === null) {
            instance = betterSqlite3(configuration.file ? configuration.file : "intendant.db")
            fs.readFileSync("./intendant.sqlite.sql").toString().split(";").forEach(request => {
                try {
                    instance.prepare(request).run()
                } catch (error) {}
            })
        }
        return instance
    }
}

export default Connection