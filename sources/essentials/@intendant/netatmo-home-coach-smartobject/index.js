import SmartObject from '../../smartobject'
import fetch from 'node-fetch'
import FormData from 'form-data'
import Package from './package.json'

class NetatmoHomeCoach extends SmartObject {

    async prepare() {
        this.device = false
        this.actions = []
        this.dataSources = []
        this.widgets = []
        await this.core.controller.cache.clear(Package.name + "-" + this.id + "-access-token")
        let result = await this.authentication()
        if (result.error) {
            return result
        }
        let resultStorage = await this.core.controller.storage.getItem(Package.name + "-" + this.id + "-device")
        if (resultStorage.error) {
            return resultStorage
        }
        if (resultStorage.data) {
            this.device = resultStorage.data
            this.actions = Package.actions
            this.dataSources = Package.dataSources
            this.widgets = Package.widgets
        } else {
            let resultDevice = await this.request(result.data)
            if (resultDevice.error) {
                return resultDevice
            }
            let devices = resultDevice.data.body.devices
            if (Array.isArray(devices) && devices.length > 0) {
                this.actions = [
                    {
                        id: "selectDevice",
                        name: "Select device",
                        alias: "select device",
                        description: "Select device",
                        settings: [
                            {
                                id: "device",
                                name: "Device",
                                type: "select",
                                default: devices[0]._id,
                                values: devices.map(device => {
                                    return device._id
                                })
                            }
                        ]
                    }
                ]
            }
        }
        return {
            package: Package.name,
            error: false,
            message: ""
        }
    }

    convertIndexToAirQuality(index) {
        switch (index) {
            case 0:
                return {
                    color: "#00873D",
                    name: "Healthy"
                }
            case 1:
                return {
                    color: "#00C781",
                    name: "Good"
                }
            case 2:
                return {
                    color: "#FFAA15",
                    name: "Fair"
                }
            case 3:
                return {
                    color: "#FF4040",
                    name: "Poor"
                }
            case 4:
                return {
                    color: "#FF4040",
                    name: "Unhealthy"
                }
            default:
                return {
                    color: "#DADADA",
                    name: "Unknown"
                }
        }
    }

    async getStatus() {
        try {
            let resultDashboard = await this.__dashboard()
            if (resultDashboard.error) {
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: {
                        status: "ERROR",
                        reason: "Connection with Netatmo cloud is broken"
                    }
                }
            }
            return {
                error: false,
                package: Package.name,
                message: "",
                data: {
                    status: "SUCCESS",
                    reason: "Home coach is online"
                }
            }
        } catch (error) {
            return {
                error: true,
                package: Package.name,
                message: "An error is occured"
            }
        }

    }

    /*
     Smartobject : override
    */

    getActions() {
        return this.actions
    }

    getDataSources() {
        return this.dataSources
    }

    getWidgets() {
        return this.widgets
    }

    async clear() {
        await this.core.controller.cache.clear(Package.name + "-" + this.id + "-access-token")
        await this.core.controller.storage.clear(Package.name + "-" + this.id + "-device")
        return {
            error: false,
            package: Package.name,
            message: ""
        }
    }


    async authentication() {
        let resultCache = await this.core.controller.cache.get({
            reference: Package.name + "-" + this.id + "-access-token"
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
        formData.append("refresh_token", this.settings.refresh_token)
        formData.append("client_id", "62459eaf23fe9055905d3d6a")
        formData.append("client_secret", "PaSEACZsZryCyTHGLlR8AKK8ltL")

        let result = await fetch("https://api.netatmo.com/oauth2/token", {
            body: formData,
            method: 'POST'
        })
        if (result.status == 200) {
            let resultJSON = await result.json()
            await this.core.controller.cache.insert({
                reference: Package.name + "-" + this.id + "-access-token",
                data: resultJSON,
                interval: 10800
            })
            return {
                error: false,
                package: Package.name,
                data: resultJSON,
                message: ""
            }
        } else {
            let resultJSON = await result.json()
            return {
                error: true,
                package: Package.name,
                message: "Invalid request"
            }
        }
    }


    async request(authentication) {
        let result = await fetch("https://api.netatmo.com/api/gethomecoachsdata", {
            headers: {
                "Authorization": "Bearer " + authentication.access_token
            }
        })
        let resultJSON = await result.json()
        if (resultJSON.status === "ok") {
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
    }

    async requestDevice(authentication) {
        let resultCache = await this.core.controller.cache.get({
            reference: Package.name + "-" + this.id + "-data"
        })
        if (resultCache.error) {
            return { error: true, package: Package.name, message: resultCache.message }
        }
        if(resultCache.cache) {
            return {
                error: false,
                package: Package.name,
                message: "",
                data: resultCache.data
            }
        }
        let result = await fetch("https://api.netatmo.com/api/gethomecoachsdata?device_id=" + this.device, {
            headers: {
                "Authorization": "Bearer " + authentication.access_token
            }
        })
        let resultJSON = await result.json()
        if (resultJSON.status === "ok") {
            await this.core.controller.cache.insert({
                reference: Package.name + "-" + this.id + "-data",
                data: resultJSON,
                interval: 1800
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
    }


    /*
        Action
    */

    async __dashboard(settings = {}) {
        let authentication = await this.authentication()
        if (authentication.error) {
            return authentication
        }
        let resultDevice = await this.requestDevice(authentication.data)
        if (resultDevice.error) {
            return resultDevice
        }
        let dashboard = resultDevice.data.body.devices[0].dashboard_data
        return {
            error: false,
            package: Package.name,
            message: "",
            data: {
                temperature: dashboard.Temperature,
                co2: dashboard.CO2,
                noise: dashboard.Noise,
                pressure: dashboard.Pressure,
                humidity: dashboard.Humidity,
                index: dashboard.health_idx,
                quality: this.convertIndexToAirQuality(dashboard.health_idx).name,
                colorQuality: this.convertIndexToAirQuality(dashboard.health_idx).color
            }
        }
    }

    async __place(settings = {}) {
        let authentication = await this.authentication()
        if (authentication.error) {
            return authentication
        }
        let resultDevice = await this.requestDevice(authentication.data)
        if (resultDevice.error) {
            return resultDevice
        }
        let place = resultDevice.data.body.devices[0].place
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
    }

    async __selectDevice(settings = {}) {
        let resultStorage = await this.core.controller.storage.setItem(Package.name + "-" + this.id + "-device", settings.device)
        if (resultStorage.error) {
            return resultStorage
        }
        let resultPrepare = await this.prepare()
        if (resultPrepare.error) {
            return resultPrepare
        }
        return {
            error: false,
            package: Package.name,
            message: "",
            data: {
                message: "Device is selected"
            }
        }
    }

}

export default NetatmoHomeCoach