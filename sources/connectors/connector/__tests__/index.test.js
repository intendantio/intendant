import connector from '../index'



let instanceConnector = new connector()

describe('@intendant/connector', () => {

    test('getOne', async () => {
        expect(await instanceConnector.getOne(1)).toEqual({ code: "ok", error: false, message: "", data: {} })
    })

    test('getOneByField', async () => {
        expect(await instanceConnector.getOneByField({})).toEqual({ code: "ok", error: false, message: "", data: {} })
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
        expect(await instanceConnector.updateAll({},{})).toEqual({ code: "ok", error: false, message: "" })
    })

    test('truncate', async () => {
        expect(await instanceConnector.truncate(1)).toEqual({ code: "ok", error: false, message: "" })
    })

    test('execute', async () => {
        expect(await instanceConnector.execute("")).toEqual({ code: "ok", error: false, message: "" })
    })

    test('insert', async () => {
        expect(await instanceConnector.insert({})).toEqual({ code: "ok", error: false, message: "" })
    })



    test('getOne - error', async () => {
        expect(await instanceConnector.getOne()).toEqual({ code: "error", error: true, message: "Invalid parameter" })
    })

    test('getOneByField - error', async () => {
        expect(await instanceConnector.getOneByField()).toEqual({ code: "error", error: true, message: "Invalid parameter" })
    })

    test('getAllByField - error', async () => {
        expect(await instanceConnector.getAllByField()).toEqual({ code: "error", error: true, message: "Invalid parameter" })
    })

    test('deleteOne - error', async () => {
        expect(await instanceConnector.deleteOne()).toEqual({ code: "error", error: true, message: "Invalid parameter" })
    })

    test('deleteAllByField - error', async () => {
        expect(await instanceConnector.deleteAllByField()).toEqual({ code: "error", error: true, message: "Invalid parameter" })
    })

    test('updateAll - error', async () => {
        expect(await instanceConnector.updateAll({})).toEqual({ code: "error", error: true, message: "Invalid parameter" })
    })

    test('execute - error', async () => {
        expect(await instanceConnector.execute()).toEqual({ code: "error", error: true, message: "Invalid parameter" })
    })

    test('insert - error', async () => {
        expect(await instanceConnector.insert()).toEqual({ code: "error", error: true, message: "Invalid parameter" })
    })

})
