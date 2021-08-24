import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import FormData from 'form-data'
import Package from './package.json'

class NetatmoHomeCoach extends SmartObject {

    constructor(settings, logger, core) {
        let configuration = require('./configuration.json')
        super(settings, logger, core, configuration)
    }


    /*
        Action
    */

    async __getData(settings = {}) {
        let resultCache = await this.core.controller.cache.get({
            reference: Package.name + "-" + this.settings.clientId
        })
        if (resultCache.error) {
            return {
                error: true,
                code: Package.name + ">getData>" + resultCache.code,
                message: resultCache.message
            }
        }
        if (resultCache.cache) {
            return {
                error: false,
                code: "ok",
                data: resultCache.data,
                message: ""
            }
        }

        let formData = new FormData()
        formData.append("grant_type", "refresh_token")
        formData.append("refresh_token", this.settings.token)
        formData.append("client_id", this.settings.clientId)
        formData.append("client_secret", this.settings.clientSecret)

        let resultRefresh = await fetch("https://api.netatmo.com/oauth2/token", {
            body: formData,
            method: 'POST'
        })
        let resultRefreshJSON = await resultRefresh.json()
        if (resultRefresh.status === 200) {
            let accessToken = resultRefreshJSON.access_token
            let result = await fetch("https://api.netatmo.com/api/gethomecoachsdata?device_id=" + this.settings.device, {
                headers: {
                    "Authorization": "Bearer " + accessToken
                }
            })
            let resultJSON = await result.json()
            if (resultJSON.status === "ok") {
                await this.core.controller.cache.insert({
                    reference: Package.name + "-" + this.settings.clientId,
                    data: resultJSON,
                    interval: 3600
                })
                return {
                    error: false,
                    code: "ok",
                    message: "",
                    data: resultJSON
                }
            } else {
                return {
                    error: true,
                    code: Package.name + ">getData>invalidRequest>" + resultJSON.status,
                    message: "Invalid request " + resultJSON.error.message
                }
            }
        } else {
            return {
                error: true,
                code: Package.name + ">getData>invalidStatus>" + resultRefresh.status,
                message: "Invalid status " + resultRefresh.status
            }
        }
    }

}

export default NetatmoHomeCoach