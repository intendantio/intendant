import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"

class Storage extends Controller {

    async getItem(id) {
        try {
            Tracing.verbose(Package.name, "Storage : [" + id + "]")
            let requestGetOne = await this.sqlStorage.getOneByField({ id: id })
            if (requestGetOne.error) {
                return requestGetOne
            }
            return {
                error: false,
                package: Package.name,
                message: '',
                data: requestGetOne.data ? JSON.parse(requestGetOne.data.value) : requestGetOne.data
            }
        } catch (error) {
            await this.removeItem(id)
            Tracing.error(Package.name,"Storage : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async setItem(id, value) {
        try {
            Tracing.verbose(Package.name, "Storage : [" + id + "] " + JSON.stringify(value))

            let requestGetOne = await this.sqlStorage.getOneByField({ id: id })
            if (requestGetOne.error) {
                return requestGetOne
            }
            if (requestGetOne.data) {
                let resultRemove = await this.removeItem(id)
                if (resultRemove.error) {
                    return resultRemove
                }
            }
            Tracing.verbose(Package.name, "Storage : [" + id + "] ")

            let resultInsertRequest = await this.sqlStorage.insert({
                id: id,
                value: JSON.stringify(value)
            })
            if (resultInsertRequest.error) {
                return resultInsertRequest
            }
            return {
                error: false,
                package: Package.name,
                message: ''
            }
        } catch (error) {
            Tracing.error(Package.name,"Storage : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async removeItem(id) {
        Tracing.verbose(Package.name, "Storage : [" + id + "] in storage")
        let resultRemove = await this.sqlStorage.deleteAllByField({ id: id })
        if (resultRemove.error) {
            return resultRemove
        }
        return {
            error: false,
            package: Package.name,
            message: ''
        }
    }

    async clear() {
        Tracing.verbose(Package.name, "Storage : clear")
        try {
            let resultTruncate = await this.sqlStorage.truncate()
            if (resultTruncate.error) {
                return resultTruncate
            }
            return {
                error: false,
                package: Package.name,
                message: ''
            }
        } catch (error) {
            Tracing.error(Package.name,"Storage : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

}

export default Storage