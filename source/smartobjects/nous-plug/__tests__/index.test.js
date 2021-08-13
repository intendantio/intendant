
import configuration from '../configuration.json'
import core from '@intendant/core/__mocks__/core'
import Package from '../package.json'

let settings = {
    id: "DEVICE",
    client: "CLIENT_ID",
    secret: "SECRET_ID",
    domain: "jest.jest"
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

    /* @intendant/nous-plug-smartobject */

  /* getAccessToken */

  test('action success > getAccessToken', async () => {
    jest.mock("node-fetch", () => {
        return async (url) => {
            return {
                json: async () => {
                    return {
                        success: true,
                        result: {
                            access_token: "jest_access"
                        }
                    }
                },
                status: 200
            }
        }
    })
    let smartobject = require('../index')
    let instanceSmartobject = new smartobject(settings, core, configuration)
    let resultAction = await instanceSmartobject.getAccessToken({})
    expect(resultAction).toEqual({
        code: "ok",
        error: false,
        message: "",
        access: "jest_access"
    })
})

test('action error status  > getAccessToken', async () => {
    jest.mock("node-fetch", () => {
        return async (url) => {
            return {
                status: 500
            }
        }
    })
    let smartobject = require('../index')
    let instanceSmartobject = new smartobject(settings, core, configuration)
    let resultAction = await instanceSmartobject.getAccessToken({})
    expect(resultAction).toEqual({
        code: Package.name + ">getAccessToken>invalidStatus>500",
        error: true,
        message: "Invalid status 500"
    })
})

test('action error request > getAccessToken', async () => {
    jest.mock("node-fetch", () => {
        return async (url) => {
            return {
                json: async () => {
                    return {
                        success: false,
                        code: "jest-error-code",
                        msg: "jest-error-msg"
                    }
                }, status: 200
            }
        }
    })
    let smartobject = require('../index')
    let instanceSmartobject = new smartobject(settings, core, configuration)
    let resultAction = await instanceSmartobject.getAccessToken({})
    expect(resultAction).toEqual({
        code: Package.name + ">getAccessToken>invalidResult",
        error: true,
        message: "Invalid result jest-error-code : jest-error-msg"
    })
})


    /* turnOn */

    test('action success > turnOn', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return {
                            success: true,
                            result: {}
                        }
                    },
                    status: 200
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        instanceSmartobject.getAccessToken = () => {
            return ({
                error: false,
                code: "ok",
                message: "",
                access: ""
            })
        } 
        let resultAction = await instanceSmartobject.action("turnOn", {color: "#88001b",birghtness: 200})
        expect(resultAction).toEqual({
            code: "ok",
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
        instanceSmartobject.getAccessToken = () => {
            return ({
                error: false,
                code: "ok",
                message: "",
                access: ""
            })
        } 
        let resultAction = await instanceSmartobject.action("turnOn", {})
        expect(resultAction).toEqual({
            code: Package.name + ">turnOn>invalidStatus>500",
            error: true,
            message: "Invalid status 500"
        })
    })

    test('action error request > turnOn', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return {
                            success: false,
                            code: "jest-error-code",
                            msg: "jest-error-msg"
                        }
                    }, status: 200
                }
            }
        })
        let smartobject = require('../index')

        let instanceSmartobject = new smartobject(settings, core, configuration)
        instanceSmartobject.getAccessToken = () => {
            return ({
                error: false,
                code: "ok",
                message: "",
                access: ""
            })
        } 
        let resultAction = await instanceSmartobject.action("turnOn", {})
        expect(resultAction).toEqual({
            code: Package.name + ">turnOn>invalidResult",
            error: true,
            message: "Invalid result jest-error-code : jest-error-msg"
        })
    })

    /* turnOff */

    test('action success > turnOff', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return {
                            success: true,
                            result: {}
                        }
                    },
                    status: 200
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        instanceSmartobject.getAccessToken = () => {
            return ({
                error: false,
                code: "ok",
                message: "",
                access: ""
            })
        } 
        let resultAction = await instanceSmartobject.action("turnOff", {})
        expect(resultAction).toEqual({
            code: "ok",
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
        instanceSmartobject.getAccessToken = () => {
            return ({
                error: false,
                code: "ok",
                message: "",
                access: ""
            })
        } 
        let resultAction = await instanceSmartobject.action("turnOff", {})
        expect(resultAction).toEqual({
            code: Package.name + ">turnOff>invalidStatus>500",
            error: true,
            message: "Invalid status 500"
        })
    })

    test('action error request > turnOff', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return {
                            success: false,
                            code: "jest-error-code",
                            msg: "jest-error-msg"
                        }
                    }, status: 200
                }
            }
        })
        let smartobject = require('../index')

        let instanceSmartobject = new smartobject(settings, core, configuration)
        instanceSmartobject.getAccessToken = () => {
            return ({
                error: false,
                code: "ok",
                message: "",
                access: ""
            })
        } 
        let resultAction = await instanceSmartobject.action("turnOff", {})
        expect(resultAction).toEqual({
            code: Package.name + ">turnOff>invalidResult",
            error: true,
            message: "Invalid result jest-error-code : jest-error-msg"
        })
    })

    /* getState */

    test('action success > getState', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    json: async () => {
                        return {
                            success: true,
                            result: {}
                        }
                    },
                    status: 200
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        instanceSmartobject.getAccessToken = () => {
            return ({
                error: false,
                code: "ok",
                message: "",
                access: ""
            })
        } 
        let resultAction = await instanceSmartobject.action("getState", {})
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            message: "",
            data: {}
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
        instanceSmartobject.getAccessToken = () => {
            return ({
                error: false,
                code: "ok",
                message: "",
                access: ""
            })
        } 
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
                        return {
                            success: false,
                            code: "jest-error-code",
                            msg: "jest-error-msg"
                        }
                    }, status: 200
                }
            }
        })
        let smartobject = require('../index')
        let instanceSmartobject = new smartobject(settings, core, configuration)
        instanceSmartobject.getAccessToken = () => {
            return ({
                error: false,
                code: "ok",
                message: "",
                access: ""
            })
        } 
        let resultAction = await instanceSmartobject.action("getState", {})
        expect(resultAction).toEqual({
            code: Package.name + ">getState>invalidResult",
            error: true,
            message: "Invalid result jest-error-code : jest-error-msg"
        })
    })

})



