import Controller from "./Controller"
import Package from '../package.json'
import StackTrace from "../utils/StackTrace"
import Tracing from "../utils/Tracing"
import Result from "../utils/Result"

class Client extends Controller {

    async insert(settings = {}) {
        try {
            if (settings.imei) {
                if (settings.name) {
                    if (settings.token) {
                        if (settings.user) {
                            let requestGetOneByField = await this.sqlClient.getOneByField({ imei: settings.imei })
                            if (requestGetOneByField.error) {
                                return requestGetOneByField
                            }
                            if (requestGetOneByField.data) {
                                let requestDelete = await this.sqlClient.deleteOne(requestGetOneByField.data.id)
                                if (requestDelete.error) {
                                    return requestDelete
                                }
                            }
                            let requestClient = await this.sqlClient.insert({
                                id: null,
                                imei: settings.imei,
                                name: settings.name,
                                token: settings.token,
                                user: settings.user,
                                lastupdate: "DATE:NOW"
                            })
                            if (requestClient.error) {
                                return requestClient
                            }
                            return new Result(Package.name,false,"")
                        } else {
                            return new Result(Package.name,true,"Missing user")
                        }
                    } else {
                        return new Result(Package.name,true,"Missing token")
                    }
                } else {
                    return new Result(Package.name,true,"Missing name")
                }
            } else {
                return new Result(Package.name,true,"Missing imei")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert client")
            return new Result(Package.name, true, "Error occurred when insert client")
        }
    }

    async getAll() {
        try {
            return await this.sqlClient.getAll()
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all client")
            return new Result(Package.name, true, "Error occurred when get all client")
        }
    }

}

export default Client