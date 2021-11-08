import Request from './Request'

class Source {

    static async getSource(query = []) {
        let resultSmartobject = await new Request().get().fetch("/api/smartobjects")
        let resultModule = await new Request().get().fetch("/api/configurations/module")
        let resultProcess = await new Request().get().fetch("/api/process")
        if (resultProcess.error) {
            return resultProcess
        } else if (resultModule.error) {
            return resultModule
        } else if (resultSmartobject.error) {
            return resultSmartobject
        } else {
            let sources = []
            if (query.includes("smartobject")) {
                resultSmartobject.data.forEach(smartobject => {
                    let actions = []
                    smartobject.actions.forEach(action => {
                        actions.push({ id: action.id, name: action.name, settings: action.settings })
                    })
                    sources.push({ id: smartobject.id, name: "Smartobject " + smartobject.reference, actions: actions, type: 'smartobject' })
                })
            }
            if (query.includes("module")) {
                resultModule.data.forEach(pModule => {
                    let actions = []
                    pModule.actions.forEach(action => {
                        actions.push({ id: action.id, name: action.name, settings: action.settings })
                    })
                    sources.push({ id: pModule.name, name: "Module " + pModule.name, actions: actions, type: 'module' })
                })
            }
            if (query.includes("process")) {
                resultProcess.data.forEach(process => {
                    let actions = []
                    if (process.mode == "simple") {
                        actions.push({
                            id: "auto",
                            name: process.name,
                            settings: process.inputs.map(input => {
                                return { id: input.reference, name: input.name, type: input.type }
                            })
                        })
                    } else {
                        actions.push({
                            id: "enable",
                            name: process.name_enable,
                            settings: process.inputs.map(input => {
                                return { id: input.reference, name: input.name, type: input.type }
                            })
                        })
                        actions.push({
                            id: "disable",
                            name: process.name_disable,
                            settings: process.inputs.map(input => {
                                return { id: input.reference, name: input.name, type: input.type }
                            })
                        })
                    }
                    sources.push({ id: process.id, name: "Processus " + process.reference, actions: actions, type: 'process' })
                })
            }
            return { data: sources, error: false, package: '', message: '' }
        }
    }

}

export default Source