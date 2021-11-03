import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import Package from './package.json'

class LaMetric extends SmartObject {

    constructor(settings, logger, core) {
        let configuration = require('./configuration.json')
        super(settings, logger, core, configuration)
    }


    /*
        Action
    */
    async __getAllNotification(settings = {}) {
        let result = await fetch("http://" + this.settings.path + "/api/v2/device/notifications", {
            headers: {
                Authorization: this.settings.apikey
            }
        })
        if (result.status == 200) {
            let resultJSON = await result.json()
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
                message: "Invalid status " + result.status
            }
        }
    }

    async __getCurrentNotification(settings = {}) {
        let result = await fetch("http://" + this.settings.path + "/api/v2/device/notifications/current", {
            headers: {
                Authorization: this.settings.apikey
            }
        })
        if (result.status == 200) {
            let resultJSON = await result.json()
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
                message: "Invalid status " + result.status
            }
        }
    }

    async __getOneNotification(settings = {}) {
        if (settings.notification) {
            let result = await fetch("http://" + this.settings.path + "/api/v2/device/notifications/" + settings.notification, {
                headers: {
                    Authorization: this.settings.apikey
                }
            })
            if (result.status == 200) {
                let resultJSON = await result.json()
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
                    message: "Invalid status " + result.status
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Missing notification"
            }
        }
    }

    async __sendNotification(settings = {}) {
        let result = await fetch("http://" + this.settings.path + "/api/v2/device/notifications", {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: this.settings.apikey
            },
            body: JSON.stringify({
                priority: settings.priority,
                icon_type: settings.iconType,
                model: {
                    frames: [
                        {
                            icon: settings.icon,
                            text: settings.text
                        }
                    ],
                    sound: {
                        category: "notifications",
                        id: settings.sound,
                        repeat: 1
                    },
                    cycles: settings.cycle
                }
            }),
            method: 'POST'
        })
        if (result.status == 200 || result.status == 201) {
            let resultJSON = await result.json()
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
                message: "Invalid status " + result.status
            }
        }
    }

    async __deleteOneNotification(settings = {}) {
        if (settings.notification) {
            let result = await fetch("http://" + this.settings.path + "/api/v2/device/notifications/" + settings.notification, {
                headers: {
                    Authorization: this.settings.apikey
                },
                method: 'DELETE'
            })
            if (result.status == 200) {
                let resultJSON = await result.json()
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
                    message: "Invalid status " + result.status
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Missing notification"
            }
        }
    }

    async __getWifi(settings = {}) {
        let result = await fetch("http://" + this.settings.path + "/api/v2/device/wifi", {
            headers: {
                Authorization: this.settings.apikey
            }
        })
        if (result.status == 200) {
            let resultJSON = await result.json()
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
                message: "Invalid status " + result.status
            }
        }
    }

    async __getState(settings = {}) {
        let result = await fetch("http://" + this.settings.path + "/api/v2/device", {
            headers: {
                Authorization: this.settings.apikey
            }
        })
        if (result.status == 200) {
            let resultJSON = await result.json()
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
                message: "Invalid status " + result.status
            }
        }
    }

    async __getVolume(settings = {}) {
        let result = await fetch("http://" + this.settings.path + "/api/v2/device/audio", {
            headers: {
                Authorization: this.settings.apikey
            }
        })
        if (result.status == 200) {
            let resultJSON = await result.json()
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
                message: "Invalid status " + result.status
            }
        }
    }

    async __updateVolume(settings = {}) {
        let volume = 50
        if (settings.volume) {
            volume = settings.volume
        }
        let result = await fetch("http://" + this.settings.path + "/api/v2/device/audio", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: this.settings.apikey
            },
            body: JSON.stringify({
                volume: volume
            })
        })
        if (result.status == 200) {
            let resultJSON = await result.json()
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
                message: "Invalid status " + result.status
            }
        }
    }

    async __getIcons(settings = {}) {
        let result = await fetch("https://developer.lametric.com/api/v2/icons?fields=id,title,url")
        let resultJSON = await result.json()
        return {
            error: false,
            package: Package.name,
            message: "",
            data: resultJSON
        }
    }


}

export default LaMetric