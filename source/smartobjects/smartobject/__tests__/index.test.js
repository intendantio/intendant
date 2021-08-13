import smartobject from '../index'
import configuration from '../configuration.json'
import core from '@intendant/core/__mocks__/core'
import Package from '../package.json'

let settings = {
    id: "1"
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

    test('action throw settings', async () => {
        let smartobject = require('../index')
        try {
            let instanceSmartobject = new smartobject({}, core, configuration)
            let resultAction = await instanceSmartobject.action("test", { message: "test-jest", throw: true })
            expect(resultAction).toEqual({ code: "@intendant/smartobject>Error>test", error: true, message: "An error has occurred when test '\"test-error\"'" })
        } catch (error) {
            expect(error).toMatch('@intendant/smartobject>Missing settings>id');
        }
    })
})



