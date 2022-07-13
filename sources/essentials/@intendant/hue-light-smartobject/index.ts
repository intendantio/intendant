import SmartObject from '../../smartobject'
import fetch from 'node-fetch'
import Package from './package.json'
import Https from 'https'
import Color from './lib/color'
import Tracing from '../../../utils/Tracing'
import Product from './products.json'
import Docs from './docs.json'

const httpsAgent = new Https.Agent({ rejectUnauthorized: false })

const BRIDGE_NAME = "@intendant/hue-hub-smartobject"

class HueLight extends SmartObject {

    private dataSources: Array<any>
    private widgets: Array<any>

    /*
        Smartobject : prepare
    */
    prepare() {
        this.actions = Package.actions.map(pAction => {
            let action = JSON.parse(JSON.stringify(pAction))
            action.settings = action.settings.map(setting => {
                if (setting.id == "colors") {
                    if (parseInt(this.settings.gradients) > 1) {
                        setting.type = "gradientpicker"
                        setting.default = ["#FFFFFF"]
                        setting.options = {
                            min: 1,
                            max: parseInt(this.settings.gradients)
                        }
                    }
                }
                return setting
            })
            return action
        })
        this.dataSources = Package.dataSources
        this.widgets = Package.widgets
    }

    /* 
        Smartobject : private 
    */
    getHueSettings() {
        let hueBridge = parseInt(this.settings.hueBridge)
        if (this.core.manager.smartobject.instances.has(hueBridge)) {
            let instance = this.core.manager.smartobject.instances.get(hueBridge)
            if (instance.configurations.name == BRIDGE_NAME) {
                return {
                    error: false,
                    package: Package.name,
                    data: instance.settings,
                    message: ""
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: "Smartobject with id " + hueBridge + " has not an type of " + BRIDGE_NAME
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Missing " + BRIDGE_NAME + " with id " + hueBridge
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

    /* 
        Smartobject : state 
    */
    async getStatus() : Promise<any> {
        try {
            let hueBridge = parseInt(this.settings.hueBridge)
            let resultState = await this.core.controller.smartobject.getStatus(hueBridge)
            if (resultState.error || resultState.data.status != "SUCCESS") {
                return resultState
            }
            let resultHue = this.getHueSettings()
            if (resultHue.error) {
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: {
                        status: "ERROR",
                        reason: resultHue.message
                    }
                }
            }
            let resultDevice = await this.core.manager.smartobject.instances.get(hueBridge).getDevice()
            if (resultDevice.error) {
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: { status: "ERROR", reason: "Connection with Hue light is broken" }
                }
            } else {
                let light = null
                resultDevice.data.data.forEach(pLight => {
                    if (pLight.id == this.settings.light) {
                        light = pLight
                    }
                })
                if (light) {
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: { status: "SUCCESS", reason: "" }
                    }
                } else {
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: { status: "ERROR", reason: "Light not found" }
                    }
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

    /*
        Smartobject : action
    */
    async __turnOn(settings: any = {}) {
        try {
            let resultHue = this.getHueSettings()
            if (resultHue.error) {
                return resultHue
            }


            let body: any = {
                on: { on: true }
            }
            if (settings.brightness) {
                body.dimming = { brightness: parseInt(settings.brightness) }
            }
            if (settings.colors) {
                if (parseInt(this.settings.gradients) == 1) {
                    let position = Color.hexToLab(settings.colors)
                    body.color = {
                        xy: {
                            x: position.x,
                            y: position.y
                        }
                    }
                } else {
                    if (Array.isArray(settings.colors) == false) {
                        return {
                            error: true,
                            package: Package.name,
                            message: "Colors must be an array"
                        }
                    }
                    let points = settings.colors.map(color => {
                        let position = Color.hexToLab(color)
                        return {
                            color: {
                                xy: {
                                    x: position.x,
                                    y: position.y
                                }
                            }
                        }
                    })
                    if (points.length == 1) {
                        points.push(points[0])
                    }
                    body.gradient = {
                        points: points
                    }
                }
            }

            if (JSON.stringify(body) == "{}") {
                let position = Color.hexToLab("#fcb900")
                body = {
                    on: { on: true },
                    dimming: { brightness: 70 },
                    color: {
                        xy: {
                            x: position.x,
                            y: position.y
                        }
                    }
                }
            }

            let result = await fetch("https://api.meethue.com/route/clip/v2/resource/light/" + this.settings.light, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + resultHue.data.access_token,
                    'hue-application-key': resultHue.data.device
                },
                agent: httpsAgent,
                body: JSON.stringify(body)
            })
            if (result.status == 200) {
                let resultJSON = await result.json()
                if (resultJSON.errors.length > 0) {
                    return {
                        error: true,
                        package: Package.name,
                        message: "Invalid request " + JSON.stringify(resultJSON.errors)
                    }
                } else {
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: resultJSON.data[0]
                    }
                }
            } else {
                try { console.log(await result.json()) } catch (error) { }
                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid status " + result.status
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

    async __turnOff(settings = {}) {
        try {
            let resultHue = this.getHueSettings()
            if (resultHue.error) {
                return resultHue
            }
            let body = {
                on: { on: false }
            }
            let result = await fetch("https://api.meethue.com/route/clip/v2/resource/light/" + this.settings.light, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + resultHue.data.access_token,
                    'hue-application-key': resultHue.data.device
                },
                agent: httpsAgent,
                body: JSON.stringify(body)
            })
            if (result.status == 200) {
                let resultJSON = await result.json()
                if (resultJSON.errors.length > 0) {
                    return {
                        error: true,
                        package: Package.name,
                        message: "Invalid request " + JSON.stringify(resultJSON.errors)
                    }
                } else {
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: resultJSON.data[0]
                    }
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid status " + result.status
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

    async __color(settings = {}) {
        try {

            let resultState = await this.__state()
            if (resultState.error) {
                return resultState
            }

            let hex = "#ffffff"

            if (resultState.data.on.on) {
                let brightness = resultState.data.dimming.brightness
                let x = resultState.data.color.xy.x
                let y = resultState.data.color.xy.y
                let rgb = Color.xyBriToRgb(x, y, brightness)
                hex = Color.rgbToHex(rgb.r, rgb.g, rgb.b)


            }

            return {
                package: Package.name,
                error: false,
                message: "",
                data: {
                    color: hex
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

    async __state(settings = {}) {
        try {
            let resultHue = this.getHueSettings()
            if (resultHue.error) {
                return resultHue
            }
            let result = await fetch("https://api.meethue.com/route/clip/v2/resource/light/" + this.settings.light, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + resultHue.data.access_token,
                    'hue-application-key': resultHue.data.device
                },
                agent: httpsAgent
            })
            if (result.status == 200) {
                let resultJSON = await result.json()
                if (resultJSON.errors.length > 0) {
                    return {
                        error: true,
                        package: Package.name,
                        message: "Invalid request " + JSON.stringify(resultJSON.errors)
                    }
                } else {
                    let currentState = resultJSON.data[0]
                    if (currentState.on.on) {
                        currentState.on.state = "online"
                    } else {
                        currentState.on.state = "offline"
                        currentState.dimming.brightness = 0
                    }
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: currentState
                    }
                }
            } else {
                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid status " + result.status
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

    /*
        Smartobject : assistant 
    */


    async executeAssistant(action, settings: any): Promise<any> {
        switch (action) {
            case "action.devices.commands.ColorAbsolute":
                let color = "000000" + settings.color.spectrumRGB.toString(16)
                let cropColor = color.slice(color.length - 6, color.length)
                await this.__turnOn({ colors: "#" + cropColor })
                break;
            case "action.devices.commands.BrightnessAbsolute":
                await this.__turnOn({ brightness: settings.brightness })
                break;
            case "action.devices.commands.OnOff":
                if (settings.on) {
                    await this.__turnOn({ brightness: 70 })
                } else {
                    await this.__turnOff({})
                }
                break
        }
        await this.core.manager.smartobject.instances.get(parseInt(this.settings.hueBridge)).clearCache()
    }


}

export default HueLight