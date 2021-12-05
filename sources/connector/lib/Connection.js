import betterSqlite3 from 'better-sqlite3'
import fs from 'fs'

let instance = null

class Connection {
    static getInstance(configuration) {
        if (instance === null) {
            if (fs.existsSync("intendant.db")) {
                instance = betterSqlite3("intendant.db")
            } else {
                throw "intendant.db is required to start intendant"
            }
        }
        return instance
    }
}

export default Connection