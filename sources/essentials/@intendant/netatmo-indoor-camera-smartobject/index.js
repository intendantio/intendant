import SmartObject from '../../smartobject'
import fetch from 'node-fetch'
import FormData from 'form-data'
import Package from './package.json'

class NetatmoIndoorCamera extends SmartObject {

    state = {
        status: "EXCEPTIONS",
        reason: "unknown",
        contents: []
    }

    async prepare() {
        try {
            this.state = {
                status: "EXCEPTIONS",
                reason: "Initialisation",
                contents: []
            }
            this.CACHE_ACCESS_TOKEN = Package.name + "-" + this.id + "-access-token"
            this.CACHE_INDOOR_CAMERA_SELECTED = Package.name + "-" + this.id + "-device"
            this.CACHE_HOME_SELECTED = Package.name + "-" + this.id + "-home"


            await this.core.controller.cache.clear(this.CACHE_ACCESS_TOKEN)

            this.device = false
            this.home = false

            this.detectors = []
            this.actions = []
            this.dataSources = []
            this.widgets = []
            this.triggers = []

            let result = await this.getAuthentication()
            if (result.error) {
                this.state = {
                    status: "ERROR",
                    reason: "Connection with Netatmo cloud is broken",
                    contents: [
                        {
                            type: "text",
                            title: "Please reset your device",
                            descriptions: []
                        }
                    ]
                }
                return result
            }
            let accessToken = result.data
            let resultHomesData = await this.getHomeData(accessToken)
            if (resultHomesData.error) {
                this.state = {
                    status: "ERROR",
                    reason: "Connection with Netatmo cloud is broken",
                    contents: [
                        {
                            type: "text",
                            title: "When get home data",
                            descriptions: [result.message]
                        }
                    ]
                }
                return resultHomesData
            }

            let resultHomeCache = await this.core.controller.storage.getItem(this.CACHE_HOME_SELECTED)

            if (resultHomeCache.error) {
                this.state = {
                    status: "ERROR",
                    reason: "Intendant cache error",
                    contents: [
                        {
                            type: "text",
                            title: "When get cache home selected",
                            descriptions: [resultHomeCache.message]
                        }
                    ]
                }
                return resultHomeCache
            } else if (resultHomeCache.data == false) {
                this.tracing.verbose(Package.name, "Step 1 - Select home")
                //Step 1 Select Home
                let homes = resultHomesData.data.body.homes
                if (homes.length == 0) {
                    this.state = {
                        status: "ERROR",
                        reason: "Home not found",
                        contents: [
                            {
                                type: "text",
                                title: "You have not home on your Netatmo account",
                                descriptions: []
                            }
                        ]
                    }
                    this.tracing.warning(Package.name, "Not find home")
                    return
                } else {
                    this.actions = [
                        {
                            id: "selectHome",
                            name: "Select home",
                            alias: "select home",
                            descriptions: "Select home",
                            settings: [
                                {
                                    id: "home",
                                    name: "Home",
                                    type: "select",
                                    default: homes[0].id,
                                    values: homes.map(home => {
                                        return {
                                            id: home.id,
                                            reference: home.name
                                        }
                                    })
                                }
                            ]
                        }
                    ]
                    this.state = {
                        status: "SUCCESS",
                        reason: "Waiting home select",
                        contents: [
                            {
                                type: "text",
                                title: "You must select your home",
                                descriptions: []
                            }
                        ]
                    }
                }
            } else {
                //Step 2 Select Indoor Device
                this.tracing.verbose(Package.name, "Step 1 - Select Indoor Device")
                let resultDeviceCache = await this.core.controller.storage.getItem(this.CACHE_INDOOR_CAMERA_SELECTED)
                if (resultDeviceCache.error) {
                    return resultDeviceCache
                } else if (resultDeviceCache.data == false) {
                    let resultHome = this.getHome(resultHomesData.data, resultHomeCache.data)
                    if (resultHome.error) {
                        return resultHome
                    }
                    let devices = resultHome.data.modules.filter(device => {
                        return device.type == "NACamera"
                    })
                    if (devices.length == 0) {
                        this.tracing.warning(Package.name, "Not find camera at this home")
                        this.state = {
                            status: "ERROR",
                            reason: "Camera not found",
                            contents: [
                                {
                                    type: "text",
                                    title: "You have not Indoor Camera associated on your Netatmo account",
                                    descriptions: ["Open Netatmo Security App and associate new camera"]
                                }
                            ]
                        }
                        return
                    }
                    this.actions = [
                        {
                            id: "selectDevice",
                            name: "Select device",
                            alias: "select device",
                            descriptions: "Select device",
                            settings: [
                                {
                                    id: "device",
                                    name: "Device",
                                    type: "select",
                                    default: devices[0].id,
                                    values: devices.map(device => {
                                        return {
                                            id: device.id,
                                            reference: device.name
                                        }
                                    })
                                }
                            ]
                        }
                    ]
                    this.state = {
                        status: "SUCCESS",
                        reason: "Waiting camera select",
                        contents: [
                            {
                                type: "text",
                                title: "You must select your camera",
                                descriptions: []
                            }
                        ]
                    }
                } else {
                    this.tracing.verbose(Package.name, "Step 3 - Execute")
                    let resultHome = this.getHome(resultHomesData.data, resultHomeCache.data)
                    if (resultHome.error) {
                        this.state = {
                            status: "ERROR",
                            reason: "An error occured",
                            contents: [
                                {
                                    type: "text",
                                    title: "When get home",
                                    descriptions: [resultHome.message]
                                }
                            ]
                        }
                        return resultHome
                    }
                    let resultCamera = this.getCamera(resultHome.data, resultDeviceCache.data)
                    if (resultCamera.error) {
                        this.state = {
                            status: "ERROR",
                            reason: "An error occured",
                            contents: [
                                {
                                    type: "text",
                                    title: "When get camera",
                                    descriptions: [resultCamera.message]
                                }
                            ]
                        }
                        return resultCamera
                    }
                    let resultDetectors = this.getDetectors(resultHome.data, resultHome.data, resultDeviceCache.data)
                    if (resultDetectors.error) {
                        this.state = {
                            status: "ERROR",
                            reason: "An error occured",
                            contents: [
                                {
                                    type: "text",
                                    title: "When get detectors",
                                    descriptions: [resultDetectors.message]
                                }
                            ]
                        }
                        return resultDetectors
                    }
                    this.home = resultHome.data
                    this.device = resultCamera.data
                    this.detectors = resultDetectors.data
                    //Missing callback registeration
                    //let resultSingleCode = await this.core.controller.authentification.getSingleCode(this.id)

                    this.detectors.forEach(detector => {
                        this.triggers.push({
                            id: "event_tag_big_move_" + detector.id,
                            name: "Movement detection on '" + detector.name + "'",
                            "type": "callback"
                        })
                    })

                    this.triggers.push({
                        id: "event_person",
                        name: "Unknwon person detection on '" + this.device.name + "'",
                        type: "callback"
                    })


                    this.triggers.push({
                        id: "movement",
                        name: "Movement detection on '" + this.device.name + "'",
                        type: "callback"
                    })

                    this.actions = [
                        {
                            id: "getContext",
                            name: "Get Home",
                            alias: "Get home",
                            descriptions: "Get home context",
                            settings: []
                        },
                        {
                            id: "getEvents",
                            name: "Get events",
                            alias: "Get events",
                            descriptions: "Get events histories",
                            settings: []
                        }
                    ]

                    this.state = {
                        status: "SUCCESS",
                        reason: "Camera is online",
                        contents: []
                    }
                }
            }
            return {
                package: Package.name,
                error: false,
                message: ""
            }
        } catch (error) {
            this.state = {
                status: "ERROR",
                reason: "An error occured",
                contents: []
            }
            this.tracing.error(Package.name, "Error occured")
        }

    }

    getHome(homeData, idHome) {
        let currentHome = false
        homeData.body.homes.forEach(home => {
            if (home.id == idHome) {
                currentHome = home
            }
        })
        if (currentHome == false) {
            this.tracing.warning(Package.name, "Home with id " + id + " not found, please select new home")
            this.core.controller.storage.clear(this.CACHE_HOME_SELECTED)
            return {
                package: Package.name,
                error: true,
                message: "Home not found"
            }
        } else {
            return {
                error: false,
                message: "",
                data: currentHome
            }
        }
    }


    getCamera(home, idCamera) {
        let currentCamera = false
        home.modules.forEach(device => {
            if (device.id == idCamera) {
                currentCamera = device
            }
        })
        if (currentCamera == false) {
            this.tracing.warning(Package.name, "Camera with id " + id + " not found, please select new home")
            this.core.controller.storage.clear(this.CACHE_INDOOR_CAMERA_SELECTED)
            return {
                package: Package.name,
                error: true,
                message: "Device not found"
            }
        } else {
            return {
                error: false,
                message: "",
                data: currentCamera
            }
        }
    }

    getDetectors(data, dataStatus, idCamera) {
        let detectors = []
        data.modules.forEach(device => {
            if (device.bridge == idCamera && device.type == "NACamDoorTag") {
                dataStatus.modules.forEach(deviceStatus => {
                    if (device.id == deviceStatus.id) {
                        device.status = deviceStatus
                    }
                })
                detectors.push(device)
            }
        })
        return {
            error: false,
            data: detectors
        }
    }


    async getAuthentication() {
        let resultCache = await this.core.controller.cache.get({
            reference: this.CACHE_ACCESS_TOKEN
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
        formData.append("client_id", "6245a26663d03b3e5916483c")
        formData.append("client_secret", "cKyCbbBpSHeeLB5pSE2JUnW7yuXp7fcM")

        let result = await fetch("https://api.netatmo.com/oauth2/token", {
            body: formData,
            method: 'POST'
        })

        if (result.status == 200) {
            let resultJSON = await result.json()
            await this.core.controller.cache.insert({
                reference: this.CACHE_ACCESS_TOKEN,
                data: resultJSON.access_token,
                interval: 10700
            })
            return {
                error: false,
                package: Package.name,
                data: resultJSON.access_token,
                message: ""
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Invalid request"
            }
        }

    }

    async getHomeData(accessToken) {
        let result = await fetch("https://api.netatmo.com/api/homesdata", {
            headers: { "Authorization": "Bearer " + accessToken }
        })
        let resultJSON = await result.json()
        if (result.status == 200) {
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
                    message: "Invalid response " + JSON.stringify(resultJSON)
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Invalid response status " + JSON.stringify(resultJSON)
            }
        }
    }

    async getStatus(settings = {}) {
        if (this.state.status == "ok") {
            let resultContext = await this.__getContext()
            if (resultContext.error) {
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: this.state
                }
            }
            this.state = {
                status: 'SUCCESS',
                reason: ""
            }
            return {
                error: false,
                package: Package.name,
                message: "",
                data: this.state
            }

        } else {
            return {
                error: false,
                package: Package.name,
                message: "",
                data: this.state
            }
        }
    }



    async getHomeDataById(idHome) {
        let resultAuthentication = await this.getAuthentication()
        if (resultAuthentication.error) {
            return resultAuthentication
        }
        let resultHomeData = await this.getHomeData(resultAuthentication.data)
        if (resultHomeData.error) {
            return resultHomeData
        }
        return await this.getHome(resultHomeData.data, idHome)
    }

    async getHomeStatusById(idHome) {
        let resultAuthentication = await this.getAuthentication()
        if (resultAuthentication.error) {
            return resultAuthentication
        }
        let result = await fetch("https://api.netatmo.com/api/homestatus?home_id=" + idHome, {
            headers: { "Authorization": "Bearer " + resultAuthentication.data }
        })
        let resultJSON = await result.json()
        if (result.status == 200) {
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
                    message: "Invalid response " + JSON.stringify(resultJSON)
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Invalid response status " + JSON.stringify(resultJSON)
            }
        }
    }

    async getCurrentHome() {
        let resultHomeCache = await this.core.controller.storage.getItem(this.CACHE_HOME_SELECTED)
        if (resultHomeCache.data == false) {
            return {
                package: Package.name,
                error: true,
                message: "Home not selected"
            }
        }
        return resultHomeCache
    }

    async getCurrentCamera() {
        let resultCameraCache = await this.core.controller.storage.getItem(this.CACHE_INDOOR_CAMERA_SELECTED)
        if (resultCameraCache.data == false) {
            return {
                package: Package.name,
                error: true,
                message: "Camera not selected"
            }
        }
        return resultCameraCache
    }

    
    async getEvents(accessToken,idHome) {
        let result = await fetch("https://api.netatmo.com/api/getevents?home_id=" + idHome, {
            headers: { "Authorization": "Bearer " + accessToken }
        })
        let resultJSON = await result.json()
        if (result.status == 200) {
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
                    message: "Invalid response " + JSON.stringify(resultJSON)
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Invalid response status " + JSON.stringify(resultJSON)
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

    getTriggers() {
        return this.triggers
    }

    /*
        Action
    */

    async __selectHome(settings = {}) {
        let resultStorage = await this.core.controller.storage.setItem(this.CACHE_HOME_SELECTED, settings.home)
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
                message: "Home is selected"
            }
        }
    }

    async __selectDevice(settings = {}) {
        let resultStorage = await this.core.controller.storage.setItem(this.CACHE_INDOOR_CAMERA_SELECTED, settings.device)
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


    async __event(settings = {}) {
        if (this.home.id == settings.home_id) {
            if (this.device.id == settings.device_id) {
                let detector = false
                this.detectors.forEach(pDetector => {
                    if (pDetector.id == settings.module_id) {
                        detector = pDetector
                    }
                })
                if (detector) {
                    this.tracing.verbose(Package.name, "Event on " + detector.name + " in " + settings.home_name + " (detector)")
                    this.executeCallback("event_" + settings.event_type + "_" + detector.id, settings)
                } else {
                    this.tracing.verbose(Package.name, "Event on " + settings.home_name + " (camera)")
                    this.executeCallback("event_" + settings.event_type, settings)
                }
            }
        }
        return {
            error: false,
            package: Package.name,
            message: ""
        }
    }


    async __getContext() {
        let resultCurrentHome = await this.getCurrentHome()
        if (resultCurrentHome.error) {
            return resultCurrentHome
        }
        let resultCurrentCamera = await this.getCurrentCamera()
        if (resultCurrentCamera.error) {
            return resultCurrentCamera
        }
        let idHome = resultCurrentHome.data
        let idCamera = resultCurrentCamera.data
        let resultHomeData = await this.getHomeDataById(idHome)
        if (resultHomeData.error) {
            return resultHomeData
        }
        let resultHomeStatus = await this.getHomeStatusById(idHome)
        if (resultHomeStatus.error) {
            return resultHomeStatus
        }
        let home = resultHomeData.data
        let homeStatus = resultHomeStatus.data.body.home
        let resultCamera = this.getCamera(homeStatus, idCamera)
        if (resultCamera.error) {
            return resultCamera
        }
        home.camera = resultCamera.data
        let resultDetectors = this.getDetectors(home, homeStatus, idCamera)
        if (resultDetectors.error) {
            return resultDetectors
        }
        delete home.persons
        delete home.modules
        home.camera.detectors = resultDetectors.data
        return {
            error: false,
            package: Package.name,
            message: "",
            data: home
        }
    }


    async __getEvents() {
        let resultCurrentHome = await this.getCurrentHome()
        if (resultCurrentHome.error) {
            return resultCurrentHome
        }
        let idHome = resultCurrentHome.data

        let resultAuthentication = await this.getAuthentication()
        if (resultAuthentication.error) {
            return resultAuthentication
        }

        let resultGetEvents = await this.getEvents(resultAuthentication.data,idHome)
        if(resultGetEvents.error) {
            return resultGetEvents
        }

        return {
            error: false,
            package: Package.name,
            message: "",
            data: resultGetEvents.data.body.home.events
        }
    }

}

export default NetatmoIndoorCamera