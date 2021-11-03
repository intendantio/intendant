import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import CryptoJS from 'crypto-js'
import Package from './package.json'

class Plug extends SmartObject {

    constructor(settings, logger, core) {
        let configuration = require('./configuration.json')
        super(settings, logger, core, configuration)
    }

    async getAccessToken() {
        let build = this.build(
            this.settings.client,
            this.settings.secret,
            "",
            "GET",
            "?grant_type=1",
            "/v1.0/token?grant_type=1",
            null
        )
        let result = await fetch("https://" + this.settings.domain + "/v1.0/token?grant_type=1", {
            method: 'GET',
            headers: {
                t: build.timestamp,
                sign: build.sign,
                sign_method: "HMAC-SHA256",
                nonce: "",
                stringToSign: "",
                client_id: this.settings.client
            }
        })
        if (result.status == 200) {
            let resultJSON = await result.json()
            if (resultJSON.success) {
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    access: resultJSON.result.access_token
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid result " + resultJSON.package + " : " + resultJSON.msg
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Invalid status " + result.status
            }
        }
    }

    /*
        Action
    */
    async __turnOn(settings = {}) {
        let accessResult = await this.getAccessToken()
        if (accessResult.error) {
            return accessResult
        } else {
            let build = this.build(
                this.settings.client,
                this.settings.secret,
                accessResult.access,
                "POST",
                "",
                "/v1.0/devices/" + this.settings.id + "/commands",
                {
                    commands: [
                        {
                            package: Package.name,
                            value: true
                        }
                    ]
                }
            )
            let result = await fetch("https://" + this.settings.domain + "/v1.0/devices/" + this.settings.id + "/commands", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    access_token: accessResult.access,
                    t: build.timestamp,
                    sign: build.sign,
                    sign_method: "HMAC-SHA256",
                    nonce: "",
                    stringToSign: "",
                    client_id: this.settings.client
                },
                body: JSON.stringify({
                    commands: [
                        {
                            package: Package.name,
                            value: true
                        }
                    ]
                })
            })

            if (result.status == 200) {
                let resultJSON = await result.json()
                if (resultJSON.success) {
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: resultJSON.result
                    }
                } else {
                    return {
                        error: true,
                        package: Package.name,
                        message: "Invalid result " + resultJSON.package + " : " + resultJSON.msg
                    }
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid status " + result.status
                }
            }
        }
    }

    async __turnOff(settings = {}) {
        let accessResult = await this.getAccessToken()
        if (accessResult.error) {
            return accessResult
        } else {
            let build = this.build(
                this.settings.client,
                this.settings.secret,
                accessResult.access,
                "POST",
                "",
                "/v1.0/devices/" + this.settings.id + "/commands",
                {
                    commands: [
                        {
                            package: Package.name,
                            value: false
                        }
                    ]
                }
            )
            let result = await fetch("https://" + this.settings.domain + "/v1.0/devices/" + this.settings.id + "/commands", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    access_token: accessResult.access,
                    t: build.timestamp,
                    sign: build.sign,
                    sign_method: "HMAC-SHA256",
                    nonce: "",
                    stringToSign: "",
                    client_id: this.settings.client
                },
                body: JSON.stringify({
                    commands: [
                        {
                            package: Package.name,
                            value: false
                        }
                    ]
                })
            })
            
            if (result.status == 200) {
                let resultJSON = await result.json()
                if (resultJSON.success) {
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: resultJSON.result
                    }
                } else {
                    return {
                        error: true,
                        package: Package.name,
                        message: "Invalid result " + resultJSON.package + " : " + resultJSON.msg
                    }
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid status " + result.status
                }
            }
        }
    }

    async __getState(settings = {}) {
        let accessResult = await this.getAccessToken()
        if (accessResult.error) {
            return accessResult
        } else {
            let build = this.build(
                this.settings.client,
                this.settings.secret,
                accessResult.access,
                "GET",
                "",
                "/v1.0/devices/" + this.settings.id,
                null
            )
            let result = await fetch("https://" + this.settings.domain + "/v1.0/devices/" + this.settings.id, {
                method: 'GET',
                headers: {
                    access_token: accessResult.access,
                    t: build.timestamp,
                    sign: build.sign,
                    sign_method: "HMAC-SHA256",
                    nonce: "",
                    stringToSign: "",
                    client_id: this.settings.client
                }
            })
            if (result.status == 200) {
                let resultJSON = await result.json()

                if (resultJSON.success) {
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: resultJSON.result
                    }
                } else {
                    return {
                        error: true,
                        package: Package.name,
                        message: "Invalid result " + resultJSON.package + " : " + resultJSON.msg
                    }
                }
            } else {

                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid status " + result.status
                }
            }
            
        }
    }

    build(clientId, secret, accessToken, httpMethod, query, urlGet, body) {
        var timestamp = new Date().getTime()
        var sha256 = CryptoJS.SHA256(body != null ? JSON.stringify(body) : body)
        var signUrl = httpMethod + "\n" + sha256 + "\n" + "" + "\n" + urlGet
        var str = clientId + accessToken + timestamp + signUrl
        var hash = CryptoJS.HmacSHA256(str, secret)
        var hashInBase64 = hash.toString()
        var sign = hashInBase64.toUpperCase()
        return {
            sign: sign,
            timestamp: timestamp,
            client_id: clientId,
            access_token: accessToken
        }
    }

}

export default Plug