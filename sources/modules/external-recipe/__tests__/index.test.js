import core from '@intendant/core/__mocks__/core'
import cache from '@intendant/core/__mocks__/cache'
import Package from '../package.json'

describe('@intendant/external-recipe-modules', () => {

    beforeEach(() => jest.resetModules());

    test('action success > getRecipe', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    text: async () => {
                        return ""
                    },
                    status: 200
                }
            }
        })
        jest.mock("match-all", () => {
            return () => {
                return {
                    toArray: () => {
                        return ["{\"props\":{\"pageProps\":{\"searchResults\":{\"hits\":{}}}}}"]
                    }
                }
            }
        })
        let pModule = require('../index')
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getRecipe({ recipe: "jest-recipe" })
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {},
            source: "https://www.marmiton.org"
        })
    })

    test('action success > getRecipe', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    text: async () => {
                        return {}
                    },
                    status: 200
                }
            }
        })
        jest.mock("match-all", () => {
            return () => {
                return {
                    toArray: () => {
                        return ["{\"props\":{\"pageProps\":{\"searchResults\":{\"hits\":{}}}}}"]
                    }
                }
            }
        })
        let pModule = require('../index')
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getRecipe()
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Recipe is missing"
        })
    })

    test('action error status > getRecipe', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    status: 500
                }
            }
        })
        jest.mock("match-all", () => {
            return () => {
                return {
                    toArray: () => {
                        return ["{\"props\":{\"pageProps\":{\"searchResults\":{\"hits\":{}}}}}"]
                    }
                }
            }
        })
        let pModule = require('../index')
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getRecipe({ recipe: "jest-recipe" })
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Invalid status 500"
        })
    })

    test('action error request > getRecipe', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    text: async () => {
                        return [{
                            error: {
                                description: "jest-error"
                            }
                        }]
                    }, status: 200
                }
            }
        })

        jest.mock("match-all", () => {
            return () => {
                return {}
            }
        })
        let pModule = require('../index')
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getRecipe({ recipe: "jest-recipe" })
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            message: "Throw exception"
        })
    })

    test('action success cache > getRecipe', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    text: async () => {
                        return ""
                    },
                    status: 200
                }
            }
        })
        jest.mock("match-all", () => {
            return () => {
                return {
                    toArray: () => {
                        return ["{\"props\":{\"pageProps\":{\"searchResults\":{\"hits\":{}}}}}"]
                    }
                }
            }
        })
        let pModule = require('../index')
        core.controller.cache = cache.inCache
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getRecipe({ recipe: "jest-recipe" })
        expect(resultAction).toEqual({
            package: Package.name,
            error: false,
            message: "",
            data: {
                jest: "cache"
            },
            source: "cache://www.marmiton.org"
        })
    })

    test('action error cache > getRecipe', async () => {
        jest.mock("node-fetch", () => {
            return async (url) => {
                return {
                    text: async () => {
                        return ""
                    },
                    status: 200
                }
            }
        })
        jest.mock("match-all", () => {
            return () => {
                return {
                    toArray: () => {
                        return ["{\"props\":{\"pageProps\":{\"searchResults\":{\"hits\":{}}}}}"]
                    }
                }
            }
        })
        let pModule = require('../index')
        core.controller.cache = cache.errorInCache
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getRecipe({ recipe: "jest-recipe" })
        expect(resultAction).toEqual({
            package: Package.name,
            error: true,
            cache: false,
            message: "jest-error"
        })
    })

})