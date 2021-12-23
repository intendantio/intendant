import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import StackTrace from '../utils/StackTrace'
import Result from '../utils/Result'

class Storage extends Controller {

    async getItem(id) {
        try {
            let requestGetOne = await this.sqlStorage.getOneByField({ id: id })
            if (requestGetOne.error) {
                return requestGetOne
            }
            return new Result(
                Package.name, 
                false, 
                "", 
                requestGetOne.data ? JSON.parse(requestGetOne.data.value) : requestGetOne.data 
            )
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get item in storage")
            return new Result(Package.name, true, "Error occurred when get item in storage")
        }
    }

    async setItem(id, value) {
        try {
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
            let resultInsertRequest = await this.sqlStorage.insert({
                id: id,
                value: JSON.stringify(value)
            })
            if (resultInsertRequest.error) {
                return resultInsertRequest
            }
            return new Result(Package.name,false,"")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when set item in storage")
            return new Result(Package.name, true, "Error occurred when set item in storage")
        }
    }

    async removeItem(id) {
        try {
            let resultRemove = await this.sqlStorage.deleteAllByField({ id: id })
            if (resultRemove.error) {
                return resultRemove
            }
            return new Result(Package.name,false,"")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when remove item in storage")
            return new Result(Package.name, true, "Error occurred when remove item in storage")
        }
        
    }

    async clear() {
        try {
            let resultTruncate = await this.sqlStorage.truncate()
            if (resultTruncate.error) {
                return resultTruncate
            }
            return new Result(Package.name,false,"")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when clear storage")
            return new Result(Package.name, true, "Error occurred when clear storage")
        }
    }

}

export default Storage