import chalk from 'chalk'

class Tracing {

    static pure(message) {
        console.log(message)
    }

    static verbose(object, message) {
        try {
            if (object && message) {
                let date = new Date()
                console.log(chalk.green.bgWhiteBright.inverse(" >> " + ( date.getHours() < 10 ? "0" + date.getHours() : date.getHours() ) + ":" + ( date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes() ) + " ") + chalk.green.bgWhiteBright.inverse(object + " ") + (" " + message + " "))
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
                console.log(chalk.yellow.bgWhiteBright.inverse(" >> " +( date.getHours() < 10 ? "0" + date.getHours() : date.getHours() ) + ":" + ( date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes() ) + " ") + chalk.yellow.bgWhiteBright.inverse(object + " ") + (" " + message + " "))
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
                console.log(chalk.red.bgWhiteBright.inverse(" >> " + ( date.getHours() < 10 ? "0" + date.getHours() : date.getHours() ) + ":" + ( date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes() ) + " ") + chalk.red.bgWhiteBright.inverse(object + " ") + (" " + message + " "))
                return true
            }
            throw "Missing parameters"
        } catch (error) {
            return false
        }
    }

}

export default Tracing