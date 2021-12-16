import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"

class Storage extends Controller {

    async getItem(id) {
        try {
            Tracing.verbose(Package.name, "Get storage [" + id + "]")
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
            Tracing.error("Storage : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async setItem(id, value) {
        try {
            Tracing.verbose(Package.name, "Set storage [" + id + "] " + JSON.stringify(value))

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
            Tracing.verbose(Package.name, "Insert [" + id + "] ")

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
            Tracing.error("Storage : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async removeItem(id) {
        Tracing.verbose(Package.name, "Remove [" + id + "] in storage")
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
        Tracing.verbose(Package.name, "Clear storage")
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
            Tracing.error("Storage : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

}

export default Storage