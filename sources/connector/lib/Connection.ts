import betterSqlite3 from 'better-sqlite3'
import Database from 'better-sqlite3/lib/database'
import fs from 'fs'

let instance: Database | null = null

class Connection {
    static getInstance() {
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