class SmartObject {

    constructor(core, id, reference, settings, tracing, configurations) {
        this.settings = settings
        this.callbacks = new Map()
        this.id = id
        this.reference = reference
        this.tracing = tracing
        this.core = core
        this.configurations = configurations
        this.actions = this.configurations.actions
        this.prepare()
    }

    async action(action, settings) {
        if (this["__" + action]) {
            try {
                this.executeCallback(action)
                return await this["__" + action](settings)
            } catch (error) {
                let message = "An error has occurred when " + action + " '" + error.toString() + "'"
                this.tracing.warning("@intendant/smartobject", message)
                return {
                    error: true,
                    package: "@intendant/smartobject",
                    message: message
                }
            }
        } else {
            this.tracing.warning("@intendant/smartobject", "Action not found " + action)
            return {
                error: true,
                package: "@intendant/smartobject",
                message: "Action not found '" + action + "'"
            }
        }
    }

    prepare() {}

    getActions() {
        return this.configurations.actions
    }

    getDataSources() {
        return this.configurations.dataSources
    }

    getWidgets() {
        return this.configurations.widgets
    }

    getTriggers() {
        return this.configurations.triggers
    }

    getProcesses() {
        return this.configurations.processes
    }


    
    /* Callback engine */ 

    addCallback(key,reference,callback) {
        this.tracing.verbose("@intendant/smartobject", "Add callback " + key + " with name " + reference)
        if(this.callbacks.has(key) == false) {
            this.callbacks.set(key,[])
        }
        let callbacks = this.callbacks.get(key)

        let find = false

        callbacks.forEach(callback => {
            if(callback.reference == reference) {
                find = true
            }
        })
        if(find) {
            return {package: "@intendant/smartobject", error: true, message: "This callback with this reference is already exist"}
        }
        callbacks.push({function: callback, reference: reference})
        return {package: "@intendant/smartobject", error: false, message: ""}
    }

    executeCallback(key, settings = {}) {
        if (this.callbacks.has(key)) {
            this.tracing.verbose("@intendant/smartobject", "Execute callback with " + key)
            let callbacks = this.callbacks.get(key)
            if (Array.isArray(callbacks)) {
                callbacks.map(callback => {
                    if (typeof callback.function == 'function') {
                        callback.function(settings)
                    }
                })
            }
        }
        return {package: "@intendant/smartobject", error: false, message: ""}
    }

    removeCallback(key,reference) {
        this.tracing.verbose("@intendant/smartobject", "Remove callback" + key + " with name " + reference)
        if (this.callbacks.has(key)) {
            let callbacks = this.callbacks.get(key)
            if (Array.isArray(callbacks)) {
                callbacks = callbacks.filter(callback => {
                    return callback.reference != reference
                })
            }
            this.callbacks.set(key,callbacks)
        }
        return {package: "@intendant/smartobject", error: false, message: ""}
    }


    /* State engine */

    async getStatus() {
        //Status : ERROR SUCCESS EXCEPTIONS
        return {
            error: false,
            package: "@intendant/smartobject",
            message: "",
            data: {
                status: "SUCCESS",
                reason: ""
            }
        }
    }
    

    async executeAssistant(action,settings = {}) {
        return {
            error: false,
            package: "@intendant/smartobject",
            message: "",
            data: {}
        }
    }


    async __information(settings = {}) {
        return {
            error: false,
            package: "@intendant/smartobject",
            message: "",
            data: {
                id: this.id
            }
        }
    }

}

export default SmartObject