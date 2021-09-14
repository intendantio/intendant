
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

    test('action success > checkPresence', async () => {
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
        let resultAction = await instanceSmartobject.action("checkPresence", {})
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            message: "",
            data: { state: { data: "jest-mock" } }
        })
    })

    test('action error status > checkPresence', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    status: 500
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("checkPresence", {})
        expect(resultAction).toEqual({
            code: Package.name + ">checkPresence>invalidStatus>500",
            error: true,
            message: "Invalid status 500"
        })
    })

    test('action error request > checkPresence', async () => {
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
        let resultAction = await instanceSmartobject.action("checkPresence", {})
        expect(resultAction).toEqual({
            code: Package.name + ">checkPresence>invalidRequest>error",
            error: true,
            message: "Invalid request \"jest-error\""
        })
    })

})



