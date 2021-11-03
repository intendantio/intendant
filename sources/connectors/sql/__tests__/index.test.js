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
        expect(await instanceConnector.getOne(1)).toEqual({ package: Package.name, data: {} })
    })

    test('getOneByField', async () => {
        expect(await instanceConnector.getOneByField({
            id: "test",
            value: "jest",
            date: "DATE:NOW"
        })).toEqual({ package: Package.name, data: {} })
    })

    test('getAllByField', async () => {
        expect(await instanceConnector.getAllByField({})).toEqual({ package: Package.name, data: [{}] })
    })

    test('getAll', async () => {
        expect(await instanceConnector.getAll()).toEqual({ package: Package.name, data: [{}] })
    })

    test('deleteOne', async () => {
        expect(await instanceConnector.deleteOne(1)).toEqual({ package: Package.name, message: "" })
    })

    test('deleteAllByField', async () => {
        expect(await instanceConnector.deleteAllByField({})).toEqual({ package: Package.name, message: "" })
    })

    test('updateAll', async () => {
        expect(await instanceConnector.updateAll({
            id: null,
            value: "jest",
            date: "DATE:NOW"
        }, {})).toEqual({ package: Package.name, message: "" })
    })

    test('truncate', async () => {
        expect(await instanceConnector.truncate(1)).toEqual({ package: Package.name, message: "" })
    })

    test('execute', async () => {
        expect(await instanceConnector.execute("")).toEqual({ package: Package.name, data: [{}] })
    })

    test('insert', async () => {
        expect(await instanceConnector.insert({

            id: null,
            value: "jest",
            date: "DATE:NOW",
            datecustom: "DATE:CUSTOMTIME"
        })).toEqual({ package: Package.name, data: [{}] })
    })

    test('getOne - error', async () => {
        expect(await instanceConnector.getOne()).toEqual({ package: Package.name,message: "Invalid parameter" })
    })

    test('getOneByField - error', async () => {
        expect(await instanceConnector.getOneByField()).toEqual({ package: Package.name,message: "Invalid parameter" })
    })

    test('getAllByField - error', async () => {
        expect(await instanceConnector.getAllByField()).toEqual({ package: Package.name,message: "Invalid parameter" })
    })

    test('deleteOne - error', async () => {
        expect(await instanceConnector.deleteOne()).toEqual({ package: Package.name,message: "Invalid parameter" })
    })

    test('deleteAllByField - error', async () => {
        expect(await instanceConnector.deleteAllByField()).toEqual({ package: Package.name,message: "Invalid parameter" })
    })

    test('updateAll - error', async () => {
        expect(await instanceConnector.updateAll()).toEqual({ package: Package.name,message: "Invalid parameter" })
    })

    test('execute - error', async () => {
        expect(await instanceConnector.execute()).toEqual({ package: Package.name,message: "Invalid parameter" })
    })

    test('insert - error', async () => {
        expect(await instanceConnector.insert()).toEqual({ package: Package.name,message: "Invalid parameter" })
    })

    let error = "jest-error"


    test('getOne - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.getOne(1)).toEqual({ package: Package.name,message: table + " catch an error : \"" + error + "\"" })
    })

    test('getOneByField - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.getOneByField({})).toEqual({ package: Package.name,message: table + " catch an error : \"" + error + "\"" })
    })

    test('getAll - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.getAll({})).toEqual({ package: Package.name,message: table + " catch an error : \"" + error + "\"" })
    })

    test('getAllByField - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.getAllByField({})).toEqual({ package: Package.name,message: table + " catch an error : \"" + error + "\"" })
    })

    test('deleteOne - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.deleteOne(1)).toEqual({ package: Package.name,message: table + " catch an error : \"" + error + "\"" })
    })

    test('truncate - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.truncate(1)).toEqual({ package: Package.name,message: table + " catch an error : \"" + error + "\"" })
    })

    test('deleteAllByField - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.deleteAllByField({})).toEqual({ package: Package.name,message: table + " catch an error : \"" + error + "\"" })
    })

    test('updateAll - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.updateAll({}, {})).toEqual({ package: Package.name,message: table + " catch an error : \"" + error + "\"" })
    })

    test('execute - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.execute("")).toEqual({ package: Package.name,message: table + " catch an error : \"" + error + "\"" })
    })

    test('insert - throw', async () => {
        instanceConnector._query = async (query) => { throw error }
        expect(await instanceConnector.insert({})).toEqual({ package: Package.name,message: table + " catch an error : \"" + error + "\"" })
    })

})