import Controller from "./Controller";
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from "../utils/Result"
import StackTrace from "../utils/StackTrace";

class Cache extends Controller {

    async get(data) {
        try {
            await this.check()
            let resultGetOne = await this.sqlCache.getOneByField({ reference: data.reference })
            if (resultGetOne.error) {
                return result
            }
            if (resultGetOne.data) {
                let result = new Result(
                    Package.name,
                    false,
                    "",
                    JSON.parse(Buffer.from(resultGetOne.data.value, "base64").toString('utf-8')).cache
                )
                result.cache = true
                return result
            } else {
                let result = new Result(Package.name, false, "", false)
                result.cache = false
                return result
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all cache")
            return new Result(Package.name, true, "Error occurred when get all cache")
        }
    }

    async clear(reference) {
        try {
            Tracing.verbose(Package.name, "Clear cache " + reference)
            return await this.sqlCache.deleteAllByField({ reference: reference })
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when clear cache")
            return new Result(Package.name, true, "Error occurred when clear cache")
        }
    }

    async insert(data) {
        try {
            await this.check()
            let resultReference = await this.sqlCache.getOneByField({ reference: data.reference })
            if (resultReference.error) {
                return resultReference
            } else if (resultReference.data == false) {
                let dataMessage = Buffer.from(JSON.stringify({ cache: data.data })).toString('base64')
                let body = {
                    reference: data.reference,
                    value: dataMessage
                }
                return await this.sqlCache.execute("INSERT INTO cache (reference,value,expiry) VALUES (@reference,@value,DATETIME('now','+" + data.interval + " seconds'))", body, true)
               
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert cache")
            return new Result(Package.name, true, "Error occurred when insert cache")
        }
    }

    async check() {
        try {
            let result = await this.sqlCache.execute("DELETE FROM cache WHERE expiry < datetime('now')", {}, true)
            if (result.error) {
                return result
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when check cache")
            return new Result(Package.name, true, "Error occurred when check cache")
        }
    }

}

export default Cache