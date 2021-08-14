
import configuration from '../configuration.json'
import core from '@intendant/core/__mocks__/core'
import cache from '@intendant/core/__mocks__/cache'
import Package from '../package.json'

let settings = {
    clientId: "jest-clientId",
    token: "jest-token",
    clientSecret: "jest-clientSecret",
    device: "jest-device"
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

    /* @intendant/netatmo-home-coach-smartobject */

    test('action success > getData', async () => {
        //API Success
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return { error: { code: '' }, status: 'ok', body: { devices: { data: "jest-mock" } } }
                    }, status: 200
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getData", {})
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            message: "",
            data: { error: { code: '' }, status: 'ok', body: { devices: { data: "jest-mock" } } }
        })
    })

    test('action error status > getData', async () => {

        //API Success
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return { error: { code: '' }, status: 'ok', body: { devices: { data: "jest-mock" } } }
                    }, status: 500
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getData", {})
        expect(resultAction).toEqual({
            code: Package.name + ">getData>invalidStatus>500",
            error: true,
            message: "Invalid status 500"
        })
    })

    test('action error request > getData', async () => {
        //API Success
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return { error: { message: 'jest-error' }, status: 'error', body: { devices: { data: "jest-mock" } } }
                    }, status: 200
                }
            }
        })
        let smartobject = require('../index')

        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getData", {})
        expect(resultAction).toEqual({
            code: Package.name + ">getData>invalidRequest>error",
            error: true,
            message: "Invalid request jest-error"
        })
    })


    test('action error cache > getData', async () => {
        //API Success
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return { error: { message: 'jest-error' }, status: 'error', body: { devices: { data: "jest-mock" } } }
                    }, status: 200
                }
            }
        })
        let smartobject = require('../index')
        core.controller.cache = cache.errorInCache
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getData", {})
        expect(resultAction).toEqual({
            code: Package.name + ">getData>@intendant/core>get>jest-error",
            error: true,
            message: "jest-error"
        })
    })

    test('action in cache > getData', async () => {
        //API Success
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return { error: { message: 'jest-error' }, status: 'error', body: { devices: { data: "jest-mock" } } }
                    }, status: 200
                }
            }
        })
        let smartobject = require('../index')
        core.controller.cache = cache.inCache
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("getData")
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            message: "",
            data: { jest: "cache" }
        })
    })


})



