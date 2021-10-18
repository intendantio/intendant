import betterSqlite3 from 'better-sqlite3'
import fs from 'fs'

let instance = null

class Connection {
    static getInstance(configuration) {
        if (instance === null) {
            if (fs.existsSync("intendant.db")) {
                instance = betterSqlite3("intendant.db")
            } else {
                instance = betterSqlite3("intendant.db")
                if (fs.existsSync("intendant.sqlite.sql")) {
                    let requests = fs.readFileSync("intendant.sqlite.sql").toString().split(";")
                    for (let index = 0; index < requests.length; index++) {
                        let request = requests[index]
                        try {
                            instance.prepare(request).run()
                        } catch (error) {
                        }
                    }
                }
            }
        }
        return instance
    }
}

export default Connection