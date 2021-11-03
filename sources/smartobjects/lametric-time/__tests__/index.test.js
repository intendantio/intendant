
import configuration from '../configuration.json'
import core from '@intendant/core/__mocks__/core'
import Package from '../package.json'

let settings = {
    id: "1",
    path: 'fakeip',
    apikey: 'apikey'
}

describe(Package.name, () => {

    beforeEach(() => jest.resetModules());

    /* @intendant/smartobject */

    test('action success', async () => {
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("test", { message: "test-jest" })
        expect(resultAction).toEqual({ package: Package.name, data: {} })
    })

    test('action not found', async () => {
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("test-no-found", { message: "test-jest" })
        expect(resultAction).toEqual({ package: Package.name,message: "Action not found 'test-no-found'" })
    })

    test('action throw', async () => {
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("test", { message: "test-jest", throw: true })
        expect(resultAction).toEqual({ package: Package.name,message: "An error has occurred when test '\"test-error\"'" })
    })

    /* @intendant/hue-switch-smartobject */


    /* getAllNotification */

    test('action success > getAllNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getAllNotification", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action error status > getAllNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { status: 500 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getAllNotification", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

    /* getCurrentNotification */

    test('action success > getCurrentNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getCurrentNotification", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action error status > getCurrentNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { status: 500 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getCurrentNotification", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

    /* getOneNotification */

    test('action success > getOneNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getOneNotification", { notification: 1 })
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action error missing notification > getOneNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getOneNotification", {})
        expect(resultAction).toEqual({
            error: true,
            package: Package.name,
            message: "Missing notification"
        })
    })

    test('action error status > getOneNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { status: 500 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getOneNotification", { notification: 1 })
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

    /* getVolume */

    test('action success > getVolume', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getVolume", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action error status > getVolume', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { status: 500 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getVolume", { notification: 1 })
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

    /* updateVolume */

    test('action success > updateVolume', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("updateVolume", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action success with volume > updateVolume', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("updateVolume", { volume: 30 })
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action error status > updateVolume', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { status: 500 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("updateVolume", { notification: 1 })
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

    /* getState */

    test('action success > getState', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getState", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action error status > getState', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { status: 500 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getState", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

    /* getWifi */

    test('action success > getWifi', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getWifi", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action error status > getWifi', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { status: 500 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getWifi", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

    /* deleteOneNotification */

    test('action success > deleteOneNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("deleteOneNotification", { notification: 1 })
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action error missing notification > deleteOneNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("deleteOneNotification", {})
        expect(resultAction).toEqual({
            error: true,
            package: Package.name,
            message: "Missing notification"
        })
    })

    test('action error status > deleteOneNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { status: 500 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("deleteOneNotification", { notification: 1 })
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

    /* sendNotification */

    test('action success > sendNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("sendNotification", { })
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action success > sendNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 201 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("sendNotification", { })
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action error status > sendNotification', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { status: 500 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("sendNotification", { })
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

     /* getIcons */

     test('action success > getIcons', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return { json: async () => { return {} }, status: 200 }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getIcons", { })
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

})



