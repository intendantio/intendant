import Controller from "./Controller";
import Package from '../package.json'

class Cache extends Controller {

    async get(data) {
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
                code: "ok"
            }
        } else {
            return {
                error: false,
                message: "",
                cache: false,
                data: false,
                code: "ok"
            }
        }
    }

    async insert(data) {
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
    }

    async check() {
        return {
            error: false,
            message: "",
            code: "ok"
        }
        let result = await this.sqlCache.execute("DELETE FROM `cache` WHERE expiry < DATE:NOW")
        if (result.error) {
            return result
        }
        return {
            error: false,
            message: "",
            code: "ok"
        }
    }

}

export default Cache