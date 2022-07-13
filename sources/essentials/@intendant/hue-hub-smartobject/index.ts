import SmartObject from '../../smartobject'
import Tracing from '../../../utils/Tracing'
import fetch from 'node-fetch'
import Package from './package.json'
import Product from './products.json'
import Docs from './docs.json'


class HueHub extends SmartObject {

    private listener: Object

    prepare() {
        this.listener = {}
    }

    isError(resultJSON) {
        if (Array.isArray(resultJSON)) {
            let result = resultJSON[0]
            if (result.error) {
                return {
                    error: true,
                    message: result.description
                }
            }
        }
        return {
            error: false
        }
    }

    async refreshToken() {
        Tracing.verbose(Package.name, "Token is expired, access_token must be refresh")
        let result = await fetch("https://api.meethue.com/v2/oauth2/token", {
            method: 'POST',
            headers: {
                Authorization: "Basic dTFJN1R3TGI0SXdhSTFYUnk3MURQZnJjWDFqSGpZQTA6dUhTYU1MVHJTYU5BNFA4OQ==",
                "Content-type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=refresh_token&refresh_token=" + this.settings.refresh_token + ""
        })
        if (result.status == 400) {
            return {
                error: true,
                package: Package.name,
                message: "Cannot refresh token"
            }
        }
        let resultJSON = await result.json()
        await this.core.controller.smartobject.updateArgument(this.id, "access_token", resultJSON.access_token)
        await this.core.controller.smartobject.updateArgument(this.id, "refresh_token", resultJSON.refresh_token)
        await this.core.manager.smartobject.update(this.id)
        return {
            error: true,
            package: Package.name,
            message: ""
        }
    }

    async saveState(settings = {}) {

    }

    async getStateCache() {
        return await this.core.controller.cache.get({
            reference: Package.name + "-state-" + this.id
        })
    }

    async getDeviceCache() {
        return await this.core.controller.cache.get({
            reference: Package.name + "-device-" + this.id
        })
    }

    async setStateCache(data) {
        await this.core.controller.cache.insert({
            reference: Package.name + "-state-" + this.id,
            data: data,
            interval: 15
        })
        return data
    }

    async clearCache() {
        await this.core.controller.cache.clear(Package.name + "-device-" + this.id)
    }

    async getDevice(settings = {}) {
        let resultCache = await this.getDeviceCache()
        if (resultCache.error) { return resultCache }
        if (resultCache.cache) {
            Tracing.verbose(Package.name, "Use cache : " + Package.name + "-device-" + this.id)
            return {
                error: false,
                package: Package.name,
                message: "",
                data: resultCache.data
            }
        }

        try {
            let result = await fetch("https://api.meethue.com/route/clip/v2/resource/light", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.settings.access_token,
                    'hue-application-key': this.settings.device
                },
            })
            if (result.status == 200) {
                let resultJSON = await result.json()
                if (resultJSON.errors.length == 0) {

                    await this.core.controller.cache.insert({
                        reference: Package.name + "-device-" + this.id,
                        data: resultJSON,
                        interval: 15
                    })

                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: resultJSON
                    }
                }
            }
            return {
                error: true,
                package: Package.name,
                message: "Error are occured"
            }
        } catch (error) {
            Tracing.error(Package.name, error.toString())
            return {
                error: true,
                package: Package.name,
                message: "Internal error server"
            }
        }
    }
    /*

    Impossible d'assigner le type '() => Promise<Result | { error: boolean; package: string; message: string; }>' au type '() => Promise<{ error: boolean; package: string; message: string; data: { status: string; reason: string; }; }>'.
    Impossible d'assigner le type 'Promise<Result | { error: boolean; package: string; message: string; }>' au type 'Promise<{ error: boolean; package: string; message: string; data: { status: string; reason: string; }; }>'.
    Impossible d'assigner le type 'Result | { error: boolean; package: string; message: string; }' au type '{ error: boolean; package: string; message: string; data: { status: string; reason: string; }; }'.
    */

    async getStatus(): Promise<any> {
        let resultCache = await this.getStateCache()
        if (resultCache.error) { return resultCache }
        if (resultCache.cache) {
            Tracing.verbose(Package.name, "Use cache " + Package.name + "-state-" + this.id)
            return {
                error: false,
                package: Package.name,
                message: "",
                data: resultCache.data
            }
        }
        try {
            let result = await fetch("https://api.meethue.com/route/clip/v2/resource/bridge", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.settings.access_token,
                    'hue-application-key': this.settings.device
                },
            })
            if (result.status == 200) {
                let resultJSON = await result.json()
                if (resultJSON.errors.length == 0) {
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: await this.setStateCache({
                            status: "SUCCESS",
                            reason: "Hub hub is online"
                        })
                    }
                } else {
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: await this.setStateCache({
                            status: "ERROR",
                            reason: "Connection with Hue Hub is broken"
                        })
                    }
                }
            } else if (result.status == 401) {
                let resultRefresh = await this.refreshToken()
                if (resultRefresh.error) {

                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: await this.setStateCache({
                            status: "ERROR",
                            reason: "Authentication with Hue hub is broken"
                        })
                    }
                } else {
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: await this.setStateCache({
                            status: "SUCCESS",
                            reason: "Hub hub is online"
                        })
                    }
                }
            } else if (result.status == 521) {
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: await this.setStateCache({
                        status: "SUCCESS",
                        reason: "Hub hub is offline"
                    })
                }
            } else {
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: await this.setStateCache({
                        status: "ERROR",
                        reason: "Invalid API status (" + result.status + ")"
                    })
                }
            }
        } catch (error) {
            Tracing.error(Package.name, error.toString())
            return {
                error: true,
                package: Package.name,
                message: "Internal error server"
            }
        }
    }

    async __content(settings = {}) {
        try {
            let result = await fetch("https://api.meethue.com/route/clip/v2/resource", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.settings.access_token,
                    'hue-application-key': this.settings.device
                },
            })
            if (result.status == 200) {
                let resultJSON = await result.json()
                let lights = 0
                let buttons = 0
                let motions = 0
                resultJSON.data.forEach(device => {
                    if (device.type == "button") {
                        buttons = buttons + 1
                    } else if (device.type == "light") {
                        lights = lights + 1
                    } else if (device.type == "motion") {
                        motions = motions + 1
                    }
                })
                if (resultJSON.errors.length == 0) {
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: {
                            lights: lights,
                            buttons: buttons,
                            motions: motions
                        }
                    }
                }
            }
            return {
                error: true,
                package: Package.name,
                message: "Error are occured"
            }
        } catch (error) {
            Tracing.error(Package.name, error.toString())
            return {
                error: true,
                package: Package.name,
                message: "Internal error server"
            }
        }
    }

    async __generate(settings = {}) {
        let result = await fetch("https://api.meethue.com/route/clip/v2/resource/light", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.settings.access_token,
                'hue-application-key': this.settings.device
            },
        })
        let resultJSON = await result.json()

        let resultRequest = []

        let lights = {}

        resultJSON.data.forEach(light => {
            if (light.metadata.archetype != "plug") {
                if (lights[light.owner.rid] == undefined) {
                    lights[light.owner.rid] = []
                }
                lights[light.owner.rid] = {
                    id: light.id,
                    gradients: light.gradient ? light.gradient.points_capable : 1
                }
            }
        })

        let resultSmartobjects = await this.core.controller.smartobject.getAll()
        if (resultSmartobjects.error) {
            return resultSmartobjects
        }

        let smartobjects = resultSmartobjects.data

        for (let key in lights) {
            let light = lights[key]

            let find = false

            smartobjects.forEach(smartobject => {
                if (smartobject.module == "@intendant/hue-light-smartobject") {
                    smartobject.arguments.forEach(argument => {
                        if (argument.reference == "light") {
                            if (argument.value.includes(light.id)) {
                                find = true
                            }
                        }
                    })
                }
            })
            if (find == false) {
                this.core.controller.smartobject.insert(key, "@intendant/hue-light-smartobject", 1,
                    [
                        { reference: "light", value: light.id },
                        { reference: "gradients", value: light.gradients },
                        { reference: "hueBridge", value: this.id }
                    ]
                )
                resultRequest.push(key)
            }
        }

        return {
            error: false,
            package: Package.name,
            message: "",
            data: resultRequest
        }
    }

}

export default HueHub