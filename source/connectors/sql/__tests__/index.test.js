import connector from '../index'
import core from '@intendant/core/__mocks__/core'

jest.mock('util', () => {
    return {
        promisify: func => {
            return {
                bind: args => {
                    return func
                }
            }
        },
    }
})

let table = "jest_table"

let instanceConnector = new connector({ connector: {} }, core, table)

describe('@intendant/sql-connector', () => {

    test('getOne', async () => {
        expect(await instanceConnector.getOne(1)).toEqual({ code: "ok", error: false, message: "", data: {} })
    })

    test('getOneByField', async () => {
        expect(await instanceConnector.getOneByField({
            id: "test",
            value: "jest",
            date: "DATE:NOW"
        })).toEqual({ code: "ok", error: false, message: "", data: {} })
    })

    test('getAllByField', async () => {
        expect(await instanceConnector.getAllByField({})).toEqual({ code: "ok", error: false, message: "", data: [{}] })
    })

    test('getAll', async () => {
        expect(await instanceConnector.getAll()).toEqual({ code: "ok", error: false, message: "", data: [{}] })
    })

    test('deleteOne', async () => {
        expect(await instanceConnector.deleteOne(1)).toEqual({ code: "ok", error: false, message: "" })
    })

    test('deleteAllByField', async () => {
        expect(await instanceConnector.deleteAllByField({})).toEqual({ code: "ok", error: false, message: "" })
    })

    test('updateAll', async () => {
        expect(await instanceConnector.updateAll({
            id: null,
            value: "jest",
            date: "DATE:NOW"
        }, {})).toEqual({ code: "ok", error: false, message: "" })
    })

    test('truncate', async () => {
        expect(await instanceConnector.truncate(1)).toEqual({ code: "ok", error: false, message: "" })
    })

    test('execute', async () => {
        expect(await instanceConnector.execute("")).toEqual({ code: "ok", error: false, message: "", data: [{}] })
    })

    test('insert', async () => {
        expect(await instanceConnector.insert({

            id: null,
            value: "jest",
            date: "DATE:NOW",
            datecustom: "DATE:CUSTOMTIME"
        })).toEqual({ code: "ok", error: false, message: "", data: [{}] })
    })

    test('getOne - error', async () => {
        expect(await instanceConnector.getOne()).toEqual({ code: "@intendant/sql-connector>getOne>error", error: true, message: "Invalid parameter" })
    })

    test('getOneByField - error', async () => {
        expect(await instanceConnector.getOneByField()).toEqual({ code: "@intendant/sql-connector>getOneByField>error", error: true, message: "Invalid parameter" })
    })

    test('getAllByField - error', async () => {
        expect(await instanceConnector.getAllByField()).toEqual({ code: "@intendant/sql-connector>getAllByField>error", error: true, message: "Invalid parameter" })
    })

    test('deleteOne - error', async () => {
        expect(await instanceConnector.deleteOne()).toEqual({ code: "@intendant/sql-connector>deleteOne>error", error: true, message: "Invalid parameter" })
    })

    test('deleteAllByField - error', async () => {
        expect(await instanceConnector.deleteAllByField()).toEqual({ code: "@intendant/sql-connector>deleteAllByField>error", error: true, message: "Invalid parameter" })
    })

    test('updateAll - error', async () => {
        expect(await instanceConnector.updateAll()).toEqual({ code: "@intendant/sql-connector>updateAll>error", error: true, message: "Invalid parameter" })
    })

    test('execute - error', async () => {
        expect(await instanceConnector.execute()).toEqual({ code: "@intendant/sql-connector>execute>error", error: true, message: "Invalid parameter" })
    })

    test('insert - error', async () => {
        expect(await instanceConnector.insert()).toEqual({ code: "@intendant/sql-connector>insert>error", error: true, message: "Invalid parameter" })
    })

    let error = "jest-error"


    test('getOne - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.getOne(1)).toEqual({ code: "@intendant/sql-connector>getOne>catchError", error: true, message: table + " catch an error : \"" + error + "\"" })
    })

    test('getOneByField - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.getOneByField({})).toEqual({ code: "@intendant/sql-connector>getOneByField>catchError", error: true, message: table + " catch an error : \"" + error + "\"" })
    })

    test('getAll - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.getAll({})).toEqual({ code: "@intendant/sql-connector>getAll>catchError", error: true, message: table + " catch an error : \"" + error + "\"" })
    })

    test('getAllByField - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.getAllByField({})).toEqual({ code: "@intendant/sql-connector>getAllByField>catchError", error: true, message: table + " catch an error : \"" + error + "\"" })
    })

    test('deleteOne - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.deleteOne(1)).toEqual({ code: "@intendant/sql-connector>deleteOne>catchError", error: true, message: table + " catch an error : \"" + error + "\"" })
    })

    test('truncate - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.truncate(1)).toEqual({ code: "@intendant/sql-connector>truncate>catchError", error: true, message: table + " catch an error : \"" + error + "\"" })
    })

    test('deleteAllByField - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.deleteAllByField({})).toEqual({ code: "@intendant/sql-connector>deleteAllByField>catchError", error: true, message: table + " catch an error : \"" + error + "\"" })
    })

    test('updateAll - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.updateAll({}, {})).toEqual({ code: "@intendant/sql-connector>updateAll>catchError", error: true, message: table + " catch an error : \"" + error + "\"" })
    })

    test('execute - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.execute("")).toEqual({ code: "@intendant/sql-connector>execute>catchError", error: true, message: table + " catch an error : \"" + error + "\"" })
    })

    test('insert - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.insert({})).toEqual({ code: "@intendant/sql-connector>insert>catchError", error: true, message: table + " catch an error : \"" + error + "\"" })
    })

})