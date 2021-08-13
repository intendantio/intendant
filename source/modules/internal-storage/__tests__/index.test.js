import core from '@intendant/core/__mocks__/core'

describe('@intendant/internal-storage-modules', () => {
    
    beforeEach(() => jest.resetModules());

    test('action success > setItem', async () => {
        let pModule = require('../index')
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__setItem({ reference: "jest-reference", value: "jest-value" })
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            message: ""
        })
    })

    test('action success > getItem', async () => {
        let pModule = require('../index')
        let instanceModule = new pModule(core)
        let resultAction = await instanceModule.__getItem({ reference: "jest-reference" })
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            data: "jest-value",
            message: ""
        })
    })

})


