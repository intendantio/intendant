import chalk from 'chalk'
import Package from '../package.json'
import Moment from 'moment'
import fs from 'fs'

class Tracing {

    static welcome() {
        Tracing.pure("" +
            "       _                            _                          \n" +
            "      | |       _                  | |             _           \n" +
            "      | |____ _| |_ _____ ____   __| |_____ ____ _| |_         \n" +
            "      | |  _ (_   _) ___ |  _ \\ / _  (____ |  _ (_   _)       \n" +
            "      | | | | || |_| ____| | | ( (_| / ___ | | | || |_         \n" +
            "      |_|_| |_| \\__)_____)_| |_|\\____\\_____|_| |_| \\__)    \n" +
            "")
        Tracing.pure("           Version: " + Package.version + " Build: " + Package.build)
        Tracing.pure("")
        return true
    }

    static getTime() {
        let date = new Date()
        return (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
    }

    static write(type,object,message) {
        fs.appendFileSync("./intendant.log",JSON.stringify({date: Moment().valueOf(), type: type, object:object, message: message }) + "\n")
    }

    static pure(message) {
        console.log(message)
    }

    static verbose(object, message) {
        try {
            if (object && message) {
                Tracing.write("VERBOSE",object,message)
                console.log(chalk.green.bgWhiteBright.inverse(" >> " + Tracing.getTime()+ " " ) + chalk.green.bgWhiteBright.inverse(object + " ") + (" " + message + " "))
                return true
            }
            throw "Missing parameters"
        } catch (error) {
            return false
        }
    }

    static warning(object, message) {
        try {
            if (object && message) {
                Tracing.write("WARNING",object,message)
                console.log(chalk.yellow.bgWhiteBright.inverse(" >> " + Tracing.getTime() + " " ) + chalk.yellow.bgWhiteBright.inverse(object + " ") + (" " + message + " "))
                return true
            }
            throw "Missing parameters"
        } catch (error) {
            return false
        }
    }

    static error(object, message) {
        try {
            if (object && message) {
                Tracing.write("ERROR",object,message)
                console.log(chalk.red.bgWhiteBright.inverse(" >> " + Tracing.getTime() + " ") + chalk.red.bgWhiteBright.inverse(object + " ") + (" " + message + " "))
                return true
            }
            throw "Missing parameters"
        } catch (error) {
            return false
        }
    }

}

export default Tracing