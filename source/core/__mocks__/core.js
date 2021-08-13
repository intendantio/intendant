const connector = require("@intendant/connector")
const logger = require("@intendant/tracing")
const cache = require("@intendant/core/__mocks__/cache")

let storage = {}

export default {
    logger: logger,
    controller: {
        cache: cache.notInCache,
        storage: {
            getItem: (id) => {
                return {
                    error: false,
                    code: 'ok',
                    message: '',
                    data: storage[id] ? storage[id] : {}
                }
            },
            setItem: (id,value) => {
                storage[id] = value
                return {
                    error: false,
                    code: 'ok',
                    message: ''
                }
            },
            removeItem: () => {
                return {
                    error: false,
                    code: 'ok',
                    message: ''
                }
            },
            clear: () => {
                return {
                    error: false,
                    code: 'ok',
                    message: ''
                }
            }
        },
        smartobject: {
            updateLastUse: () => { }
        }
    },
    connector: connector
}
