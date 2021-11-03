import connector from '../index'



let instanceConnector = new connector()

describe('@intendant/connector', () => {

    test('getOne', async () => {
        expect(await instanceConnector.getOne(1)).toEqual({ package: Package.name, data: {} })
    })

    test('getOneByField', async () => {
        expect(await instanceConnector.getOneByField({})).toEqual({ package: Package.name, data: {} })
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
        expect(await instanceConnector.updateAll({},{})).toEqual({ package: Package.name, message: "" })
    })

    test('truncate', async () => {
        expect(await instanceConnector.truncate(1)).toEqual({ package: Package.name, message: "" })
    })

    test('execute', async () => {
        expect(await instanceConnector.execute("")).toEqual({ package: Package.name, message: "" })
    })

    test('insert', async () => {
        expect(await instanceConnector.insert({})).toEqual({ package: Package.name, message: "" })
    })



    test('getOne - error', async () => {
        expect(await instanceConnector.getOne()).toEqual({ package: Package.name, message: "Invalid parameter" })
    })

    test('getOneByField - error', async () => {
        expect(await instanceConnector.getOneByField()).toEqual({ package: Package.name, message: "Invalid parameter" })
    })

    test('getAllByField - error', async () => {
        expect(await instanceConnector.getAllByField()).toEqual({ package: Package.name, message: "Invalid parameter" })
    })

    test('deleteOne - error', async () => {
        expect(await instanceConnector.deleteOne()).toEqual({ package: Package.name, message: "Invalid parameter" })
    })

    test('deleteAllByField - error', async () => {
        expect(await instanceConnector.deleteAllByField()).toEqual({ package: Package.name, message: "Invalid parameter" })
    })

    test('updateAll - error', async () => {
        expect(await instanceConnector.updateAll({})).toEqual({ package: Package.name, message: "Invalid parameter" })
    })

    test('execute - error', async () => {
        expect(await instanceConnector.execute()).toEqual({ package: Package.name, message: "Invalid parameter" })
    })

    test('insert - error', async () => {
        expect(await instanceConnector.insert()).toEqual({ package: Package.name, message: "Invalid parameter" })
    })

})
