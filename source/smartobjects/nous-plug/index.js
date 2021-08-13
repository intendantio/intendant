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
                    code: "ok",
                    message: "",
                    access: resultJSON.result.access_token
                }
            } else {
                return {
                    error: true,
                    code: Package.name + ">getAccessToken>invalidResult",
                    message: "Invalid result " + resultJSON.code + " : " + resultJSON.msg
                }
            }
        } else {
            return {
                error: true,
                code: Package.name + ">getAccessToken>invalidStatus>" + result.status,
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
                            code: settings.code,
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
                            code: settings.code,
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
                        code: "ok",
                        message: "",
                        data: resultJSON.result
                    }
                } else {
                    return {
                        error: true,
                        code: Package.name + ">turnOn>invalidResult",
                        message: "Invalid result " + resultJSON.code + " : " + resultJSON.msg
                    }
                }
            } else {
                return {
                    error: true,
                    code: Package.name + ">turnOn>invalidStatus>" + result.status,
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
                            code: settings.code,
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
                            code: settings.code,
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
                        code: "ok",
                        message: "",
                        data: resultJSON.result
                    }
                } else {
                    return {
                        error: true,
                        code: Package.name + ">turnOff>invalidResult",
                        message: "Invalid result " + resultJSON.code + " : " + resultJSON.msg
                    }
                }
            } else {
                return {
                    error: true,
                    code: Package.name + ">turnOff>invalidStatus>" + result.status,
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
                        code: "ok",
                        message: "",
                        data: resultJSON.result
                    }
                } else {
                    return {
                        error: true,
                        code: Package.name + ">getState>invalidResult",
                        message: "Invalid result " + resultJSON.code + " : " + resultJSON.msg
                    }
                }
            } else {

                return {
                    error: true,
                    code: Package.name + ">getState>invalidStatus>" + result.status,
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