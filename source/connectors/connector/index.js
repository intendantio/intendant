class Connector {

    constructor(configuration, core, name) {
        this._configuration = configuration
        this._core = core
        this._name = name
        return this
    }

    async getOne(id) {
        console.log("test")
        if(typeof id == 'string' || typeof id == 'number') {
            return {
                code: "ok",
                message: "",
                error: false,
                data: {}
            }
        } else {
            return {
                code: "error",
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async getOneByField(wheres) {
        if(typeof wheres == 'object') {
            return {
                code: "ok",
                message: "",
                error: false,
                data: {}
            }
        } else {
            return {
                code: "error",
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async getAllByField(wheres) {
        if(typeof wheres == 'object') {
            return {
                code: "ok",
                message: "",
                error: false,
                data: [
                    {}
                ]
            }
        } else {
            return {
                code: "error",
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async getAll() {
        return {
            code: "ok",
            message: "",
            error: false,
            data: [
                {}
            ]
        }
    }

    async deleteOne(id) {
        if(typeof id == 'string' || typeof id == 'number') {
            return {
                code: "ok",
                message: "",
                error: false
            }
        } else {
            return {
                code: "error",
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async deleteAllByField(fields) {
        if(typeof fields == 'object') {
            return {
                code: "ok",
                message: "",
                error: false
            }
        } else {
            return {
                code: "error",
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async updateAll(sets,wheres) {
        if(typeof wheres == 'object' && typeof sets == 'object') {
            return {
                code: "ok",
                message: "",
                error: false
            }
        } else {
            return {
                code: "error",
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async truncate() {
        return {
            code: "ok",
            message: "",
            error: false
        }
    }

    async execute(request) {
        if(typeof request == 'string') {
            return {
                code: "ok",
                message: "",
                error: false
            }
        } else {
            return {
                code: "error",
                message: "Invalid parameter",
                error: true
            }
        }
        
    }
    
    async insert(fields) {
        if(typeof fields == 'object') {
            return {
                code: "ok",
                message: "",
                error: false
            }
        } else {
            return {
                code: "error",
                message: "Invalid parameter",
                error: true
            }
        }
        
    }

}

export default Connector