import chalk from 'chalk'
import Package from '../package.json'

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

    static pure(message) {
        console.log(message)
    }

    static verbose(object, message) {
        try {
            if (object && message) {
                let date = new Date()
                console.log(chalk.green.bgWhiteBright.inverse(" >> " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + " ") + chalk.green.bgWhiteBright.inverse(object + " ") + (" " + message + " "))
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
                let date = new Date()
                console.log(chalk.yellow.bgWhiteBright.inverse(" >> " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + " ") + chalk.yellow.bgWhiteBright.inverse(object + " ") + (" " + message + " "))
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
                let date = new Date()
                console.log(chalk.red.bgWhiteBright.inverse(" >> " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + " ") + chalk.red.bgWhiteBright.inverse(object + " ") + (" " + message + " "))
                return true
            }
            throw "Missing parameters"
        } catch (error) {
            return false
        }
    }

}

export default Tracing