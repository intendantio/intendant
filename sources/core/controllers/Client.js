import Controller from "./Controller"
import Package from '../package.json'
import fetch from 'node-fetch'

class Client extends Controller {

    async insert(settings = {}) {
        try {
            this.core.logger.verbose(Package.name, "Insert client [" + settings.imei + "]")
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
            this.core.logger.error("Client : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async notify(title, message) {
        try {
            let clientRequest = await this.sqlClient.getAll()
            if (clientRequest.error) {
                return clientRequest
            }
            let tmpBody = []
            clientRequest.data.forEach(client => {
                if (client.token !== "") {
                    tmpBody.push({
                        "to": client.token,
                        "title": "intendant - " + title,
                        "body": message
                    })
                }
            })
            await fetch("https://exp.host/--/api/v2/push/send", {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(tmpBody)
            })
        } catch (error) {
            this.core.logger.error("Client : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

}

export default Client