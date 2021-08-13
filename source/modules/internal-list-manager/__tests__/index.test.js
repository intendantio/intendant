import core from '@intendant/core/__mocks__/core'
import Package from '../package.json'

describe('@intendant/internal-list-manager-modules', () => {
    
    beforeEach(() => jest.resetModules());
    
    let pModule = require('../index')
    let instanceModule = new pModule(core)

    instanceModule.__create({reference: "jest-list"})
    

    test('action success > getAll', async () => {
        let resultAction = await instanceModule.__getAll()
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            data: ["jest-list"],
            message: ""
        })
    })

    test('action success > getAll', async () => {
        let resultAction = await instanceModule.__getAll()
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            data: [ "jest-list" ],
            message: ""
        })
    })

    test('action missing reference > getSize', async () => {
        let resultAction = await instanceModule.__getSize({})
        expect(resultAction).toEqual({
            code: Package.name + ">getSize>reference>missing",
            error: true,
            message: "Reference is missing"
        })
    })

    test('action missing list > getSize', async () => {
        let resultAction = await instanceModule.__getSize({reference: "jest-list-not-found"})
        expect(resultAction).toEqual({
            code: Package.name + ">getSize>list>missing",
            error: true,
            message: "List is missing"
        })
    })

    test('action success > getSize', async () => {
        let resultAction = await instanceModule.__getSize({reference: "jest-list"})
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            data: { size: 0 },
            message: ""
        })
    })
    

    /* getOne */
    
    test('action missing reference > getOne', async () => {
        let resultAction = await instanceModule.__getOne({})
        expect(resultAction).toEqual({
            code: Package.name + ">getOne>reference>missing",
            error: true,
            message: "Reference is missing"
        })
    })
    
    test('action missing list > getOne', async () => {
        let resultAction = await instanceModule.__getOne({reference: "jest-list-not-found"})
        expect(resultAction).toEqual({
            code: Package.name + ">getOne>list>missing",
            error: true,
            message: "List is missing"
        })
    })
    
    test('action success > getOne', async () => {
        let resultAction = await instanceModule.__getOne({reference: "jest-list"})
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            data: [],
            message: ""
        })
    })

    /* Create */
    
    test('action missing list > create', async () => {
        let resultAction = await instanceModule.__create({reference: "jest-list"})
        expect(resultAction).toEqual({
            code: Package.name + ">create>list>alreadyExist",
            error: true,
            message: "List already exist"
        })
    })
    
    test('action missing reference > create', async () => {
        let resultAction = await instanceModule.__create({})
        expect(resultAction).toEqual({
            code: Package.name + ">create>reference>missing",
            error: true,
            message: "Reference is missing"
        })
    })

    /* Add */
    
    test('action missing reference > add', async () => {
        let resultAction = await instanceModule.__add({})
        expect(resultAction).toEqual({
            code: Package.name + ">add>reference>missing",
            error: true,
            message: "Reference is missing"
        })
    })
    
    test('action missing item > add', async () => {
        let resultAction = await instanceModule.__add({reference:"jest-list"})
        expect(resultAction).toEqual({
            code: Package.name + ">add>item>missing",
            error: true,
            message: "Item is missing"
        })
    })
    
    test('action missing list > add', async () => {
        let resultAction = await instanceModule.__add({reference: "jest-list-not-found",item: "test"})
        expect(resultAction).toEqual({
            code: Package.name + ">add>list>missing",
            error: true,
            message: "List is missing"
        })
    })
    
    test('action success > add', async () => {
        let resultAction = await instanceModule.__add({reference:"jest-list",item:"test"})
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            message: ""
        })
    })
    
    /* remove */
    
    test('action missing reference > remove', async () => {
        let resultAction = await instanceModule.__remove({})
        expect(resultAction).toEqual({
            code: Package.name + ">remove>reference>missing",
            error: true,
            message: "Reference is missing"
        })
    })
    
    test('action missing list > remove', async () => {
        let resultAction = await instanceModule.__remove({reference: "jest-list"})
        expect(resultAction).toEqual({
            code: Package.name + ">remove>index>missing",
            error: true,
            message: "Index is missing"
        })
    })

    
    test('action success > clear', async () => {
        let resultAction = await instanceModule.__clear({reference: "jest-list"})
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            message: ""
        })
    })
    
    test('action missing list > clear', async () => {
        let resultAction = await instanceModule.__clear({reference: "jest-list-not-found"})
        expect(resultAction).toEqual({
            code: Package.name + ">clear>list>missing",
            error: true,
            message: "List is missing"
        })
    })
    test('action missing reference > clear', async () => {
        let resultAction = await instanceModule.__clear({})
        expect(resultAction).toEqual({
            code: Package.name + ">clear>reference>missing",
            error: true,
            message: "Reference is missing"
        })
    })
    
    
    test('action success > delete', async () => {
        let resultAction = await instanceModule.__delete({reference: "jest-list"})
        expect(resultAction).toEqual({
            code: "ok",
            error: false,
            message: ""
        })
    })
    
    test('action missing list > delete', async () => {
        let resultAction = await instanceModule.__delete({reference: "jest-list-not-found"})
        expect(resultAction).toEqual({
            code: Package.name + ">delete>list>missing",
            error: true,
            message: "List is missing"
        })
    })
    test('action missing reference > delete', async () => {
        let resultAction = await instanceModule.__delete({})
        expect(resultAction).toEqual({
            code: Package.name + ">delete>reference>missing",
            error: true,
            message: "Reference is missing"
        })
    })
})


