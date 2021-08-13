import Controller from "./Controller"
import Package from '../package.json'
import fetch from 'node-fetch'

class Client extends Controller {

    async insert(settings = {}) {
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
                            code: 'ok',
                            message: ''
                        }
                    } else {
                        return {
                            error: true,
                            code: 'user-missing',
                            message: 'User is missing'
                        }
                    }
                } else {
                    return {
                        error: true,
                        code: 'token-missing',
                        message: 'Token is missing'
                    }
                }
            } else {
                return {
                    error: true,
                    code: 'name-missing',
                    message: 'Name is missing'
                }
            }
        } else {
            return {
                error: true,
                code: 'imei-missing',
                message: 'Imei is missing'
            }
        }
    }

    async notify(title, message) {
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
    }

}

export default Client