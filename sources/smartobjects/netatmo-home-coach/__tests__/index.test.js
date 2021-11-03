
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
            package: Package.name,
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
            package: Package.name,
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
            package: Package.name,
            error: false,
            message: "",
            data: { jest: "cache" }
        })
    })


})



