
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

    /* @intendant/hue-sensor-smartobject */


    /* turnOn */

    test('action success > turnOn', async () => {
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
        let resultAction = await instanceSmartobject.action("turnOn", {color: "#88001b",birghtness: 200})
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action error status > turnOn', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    status: 500
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("turnOn", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

    test('action error request > turnOn', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return [{
                            error: {
                                description: "jest-error"
                            }
                        }]
                    }, status: 200
                }
            }
        })
        let smartobject = require('../index')

        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("turnOn", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid request jest-error"
        })
    })

    /* turnOff */

    test('action success > turnOff', async () => {
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
        let resultAction = await instanceSmartobject.action("turnOff", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action error status > turnOff', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    status: 500
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("turnOff", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

    test('action error request > turnOff', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return [{
                            error: {
                                description: "jest-error"
                            }
                        }]
                    }, status: 200
                }
            }
        })
        let smartobject = require('../index')

        let instanceSmartobject = new smartobject(settings, core, configuration)
        let resultAction = await instanceSmartobject.action("turnOff", {})
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid request jest-error"
        })
    })

    /* status */

    test('action success > getState', async () => {
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
            package: Package.name,
            error: false,
            message: "",
            data: {}
        })
    })

    test('action error getState > status', async () => {
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
            package: Package.name,
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
            package: Package.name,
            error: true,
            message: "Invalid request jest-error"
        })
    })

})



