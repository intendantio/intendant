import mysql from 'mysql'

let instance = null

class Connection {
    static getInstance(configuration) {
        if (instance === null) {
            instance = mysql.createConnection(configuration.connector)
            instance.connect()
        }
        return instance
    }
}

export default Connection