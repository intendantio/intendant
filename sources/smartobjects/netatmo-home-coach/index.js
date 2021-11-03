import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import FormData from 'form-data'
import Package from './package.json'

class NetatmoHomeCoach extends SmartObject {

    constructor(settings, logger, core) {
        let configuration = require('./configuration.json')
        super(settings, logger, core, configuration)
    }

    async request() {
        let resultCache = await this.core.controller.cache.get({
            reference: Package.name + "-" + this.settings.clientId
        })
        if (resultCache.error) {
            return { error: true, package: Package.name, message: resultCache.message }
        }
        if (resultCache.cache) {
            return {
                error: false,
                package: Package.name,
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
                    reference: Package.name,
                    data: resultJSON,
                    interval: 3600
                })
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: resultJSON
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid request " + resultJSON.error.message
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Invalid status " + resultRefresh.status
            }
        }

    }

    /*
        Action
    */

    async __dashboard(settings = {}) {
        let configuration = await this.request()
        if (configuration.error) {
            return configuration
        }
        let device = false
        configuration.data.body.devices.forEach(pDevice => {
            if (pDevice._id == this.settings.device) { device = pDevice }
        })
        if (device) {
            let dashboard = device.dashboard_data
            return {
                error: false,
                package: Package.name,
                message: "",
                data: {
                    temperature: dashboard.Temperature,
                    co2: dashboard.CO2,
                    noise: dashboard.Noise,
                    pressure: dashboard.Pressure,
                    humidity: dashboard.humidity
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Device " + this.settings.device + " not found"
            }
        }
    }

    async __place(settings = {}) {
        let configuration = await this.request()
        if (configuration.error) {
            return configuration
        }
        let device = false
        configuration.data.body.devices.forEach((pDevice) => {
            if (pDevice._id == this.settings.device) { device = pDevice }
        })
        if (device) {
            let place = device.place
            return {
                error: false,
                package: Package.name,
                message: "",
                data: {
                    altitude: place.altitude,
                    city: place.city,
                    country: place.country,
                    timezone: place.timezone,
                    location: place.location
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Device " + this.settings.device + " not found"
            }
        }
    }

    async __configuration(settings = {}) {
        return await this.request()
    }

}

export default NetatmoHomeCoach