import Controller from "./Controller"
import Package from '../package.json'

class Storage extends Controller {

    async getItem(id) {
        let requestGetOne = await this.sqlStorage.getOneByField({ id: id })
        if (requestGetOne.error) {
            return requestGetOne
        }
        try {
            return {
                error: false,
                package: Package.name,
                message: '',
                data: requestGetOne.data ? JSON.parse(requestGetOne.data.value) : requestGetOne.data
            }
        } catch (error) {
            await this.removeItem(id)
            return {
                error: false,
                package: Package.name,
                message: '',
                data: {}
            }
        }
        
    }

    async setItem(id, value) {
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
        let resultTruncate = await this.sqlStorage.truncate()
        if (resultTruncate.error) {
            return resultTruncate
        }
        return {
            error: false,
            package: Package.name,
            message: ''
        }
    }

}

export default Storage