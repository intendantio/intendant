import Controller from "./Controller";
import Package from '../package.json'

class Cache extends Controller {

    async get(data) {
        try {
            this.core.logger.verbose(Package.name, "Get cache [" + data.reference + "]")
            await this.check()
            let result = await this.sqlCache.getOneByField({reference: data.reference})
            if(result.error) {
                return result
            }
            if(result.data) {
                this.core.logger.verbose(Package.name,"Find cache " + data.reference)
                return {
                    error: false,
                    message: "",
                    cache: true,
                    data: JSON.parse(Buffer.from(result.data.value,"base64").toString('utf-8')).cache,
                    package: Package.name
                }
            } else {
                return {
                    error: false,
                    message: "",
                    cache: false,
                    data: false,
                    package: Package.name
                }
            }
        } catch (error) {
            this.core.logger.error("Get cache " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async insert(data) {
        try {
            await this.check()
            let resultReference = await this.sqlCache.getOneByField({reference: data.reference})
            if(resultReference.error) {
                return resultReference
            } else if(resultReference.data == false) {
                let dataMessage =  Buffer.from(JSON.stringify({cache:data.data})).toString('base64') 
                return await this.sqlCache.insert({
                    id: null,
                    reference: data.reference,
                    value: dataMessage,
                    expiry: "DATE:CUSTOM" + data.interval
                })
            }
        } catch (error) {
            this.core.logger.error("Insert cache " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async check() {
        try {
            let result = await this.sqlCache.execute("DELETE FROM cache WHERE expiry < datetime('now')")
            if (result.error) {
                return result
            }
            return {
                error: false,
                message: "",
                package: Package.name
            }
        } catch (error) {
            this.core.logger.error("Check cache " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

}

export default Cache