
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
        expect(resultAction).toEqual({ code: "ok", error: false, message: "test-jest", data: {} })
    })

    test('action not found', async () => {
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("test-no-found", { message: "test-jest" })
        expect(resultAction).toEqual({ code: "@intendant/smartobject>Action>NotFound>test-no-found", error: true, message: "Action not found 'test-no-found'" })
    })

    test('action throw', async () => {
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("test", { message: "test-jest", throw: true })
        expect(resultAction).toEqual({ code: "@intendant/smartobject>Error>test", error: true, message: "An error has occurred when test '\"test-error\"'" })
    })

    /* @intendant/hue-sensor-smartobject */

    /* getConfiguration */

    test('action success > getConfiguration', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return { state: { data: "jest-mock" } }
                    },
                    status: 200
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getConfiguration", {})
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            message: "",
            data: { state: { data: "jest-mock" } }
        })
    })

    test('action error status > getConfiguration', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    status: 500
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getConfiguration", {})
        expect(resultAction).toEqual({
            code: Package.name + ">getConfiguration>invalidStatus>500",
            error: true,
            message: "Invalid status 500"
        })
    })

    test('action error request > getConfiguration', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return [{ error: "jest-error" }]
                    }, status: 200
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getConfiguration", {})
        expect(resultAction).toEqual({
            code: Package.name + ">getConfiguration>invalidRequest>error",
            error: true,
            message: "Invalid request jest-error"
        })
    })



    /* getState */

    test('action error > getState', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return {}
                    },
                    status: 200
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getState", {})
        expect(resultAction).toEqual({
            code: Package.name + ">getState>invalidResult",
            error: true,
            message: "Invalid result",
        })
    })

    test('action success > getState', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return { capabilities: { inputs: [{ events: [{ buttonevent: 1 }] }] }, state: { buttonevent: 1, lastupdate: null } }
                    },
                    status: 200
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getState", {})
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            message: "",
            data: {
                event: 1,
                lastEvent: 0,
                type: ""
            }
        })
    })

    test('action error status > getState', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    status: 500
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getState", {})
        expect(resultAction).toEqual({
            code: Package.name + ">getState>invalidStatus>500",
            error: true,
            message: "Invalid status 500"
        })
    })

    test('action error request > getState', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return [{ error: "jest-error" }]
                    }, status: 200
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getState", {})
        expect(resultAction).toEqual({
            code: Package.name + ">getState>invalidRequest>error",
            error: true,
            message: "Invalid request jest-error"
        })
    })

})



