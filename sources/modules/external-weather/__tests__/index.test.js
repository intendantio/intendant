import core from '@intendant/core/__mocks__/core'
import cache from '@intendant/core/__mocks__/cache'
import Package from '../package.json'




describe('@intendant/external-weather-modules', () => {

    beforeEach(() => jest.resetModules());

    /* turnOn */

    test('action success > getWeather', async () => {
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
        let pModule = require('../index')
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getWeather({ city: "jest-city" })
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {},
            source: "https://www.prevision-meteo.ch"
        })
    })



    test('action success > getWeather', async () => {
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
        let pModule = require('../index')
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getWeather()
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "City is missing"
        })
    })

    test('action error status > getWeather', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    status: 500
                }
            }
        })
        let pModule = require('../index')
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getWeather({ city: "jest-city" })
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

    test('action error request > getWeather', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return undefined
                    }, status: 200
                }
            }
        })
        let pModule = require('../index')
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getWeather({ city: "jest-city" })
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Throw exception"
        })
    })

    test('action success cache > getWeather', async () => {
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
        let pModule = require('../index')
        core.controller.cache = cache.inCache
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getWeather({ city: "jest-city" })
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {
                jest: "cache"
            },
            source: "cache://www.prevision-meteo.ch"
        })
    })

    test('action error cache > getWeather', async () => {
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
        let pModule = require('../index')
        core.controller.cache = cache.errorInCache
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getWeather({ city: "jest-city" })
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            cache: false,
            message: "jest-error"
        })
    })

})