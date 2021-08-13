import chalk from 'chalk'
import Tracing from '@intendant/tracing'

class Console extends Tracing {

    static verbose(object, message) {
        try {
            if (object && message) {
                console.log(chalk.green.bgWhiteBright.inverse(" >> ") + chalk.green.bgWhiteBright.inverse(object) + (" " + message + " "))
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
                console.log(chalk.yellow.bgWhiteBright.inverse(" >> ") + chalk.yellow.bgWhiteBright.inverse(object) + (" " + message + " "))
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
                console.log(chalk.red.bgWhiteBright.inverse(" >> ") + chalk.red.bgWhiteBright.inverse(object) + (" " + message + " "))
                return true
            }
            throw "Missing parameters"
        } catch (error) {
            return false
        }
    }

}

export default Console