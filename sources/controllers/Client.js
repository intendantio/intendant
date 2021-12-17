import Controller from "./Controller"
import Package from '../package.json'
import fetch from 'node-fetch'
import Tracing from "../utils/Tracing"

class Client extends Controller {

    async insert(settings = {}) {
        try {
            Tracing.verbose(Package.name, "Insert client [" + settings.imei + "]")
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
                            return {
                                error: false,
                                package: Package.name,
                                message: ''
                            }
                        } else {
                            return {
                                error: true,
                                package: Package.name,
                                message: 'User is missing'
                            }
                        }
                    } else {
                        return {
                            error: true,
                            package: Package.name,
                            message: 'Token is missing'
                        }
                    }
                } else {
                    return {
                        error: true,
                        package: Package.name,
                        message: 'Name is missing'
                    }
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: 'Imei is missing'
                }
            }
        } catch (error) {
            Tracing.error("Client : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async getAll() {
        try {
            return await this.sqlClient.getAll()
        } catch (error) {
            Tracing.error("Client : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

}

export default Client