import Controller from "./Controller"
import Package from '../package.json'

class Storage extends Controller {

    async getItem(id) {
        try {
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
            this.core.logger.error("Storage : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async setItem(id, value) {
        try {
            let requestGetOne = await this.sqlStorage.getOneByField({ id: id })
            if (requestGetOne.error) {
                return requestGetOne
            }
            if (requestGetOne.data) {
                let resultRemove = await this.sqlStorage.deleteAllByField({ id: id })
                if (resultRemove.error) {
                    return resultRemove
                }
            }
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
            this.core.logger.error("Storage : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async removeItem(id) {
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
            this.core.logger.error("Storage : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

}

export default Storage