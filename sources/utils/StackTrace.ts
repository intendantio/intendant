import fs from 'fs'
class StackTrace {

    static save(error) {
        try {
            fs.appendFileSync("./error.log",error.stack)
        } catch (error) {}
    }

}

export default StackTrace