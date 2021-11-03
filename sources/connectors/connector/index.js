class Connector {

    constructor(configuration, core, name) {
        this._configuration = configuration
        this._core = core
        this._name = name
        return this
    }

    async getOne(id) {
        if(typeof id == 'string' || typeof id == 'number') {
            return {
                package: Package.name,
                message: "",
                error: false,
                data: {}
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async getOneByField(wheres) {
        if(typeof wheres == 'object') {
            return {
                package: Package.name,
                message: "",
                error: false,
                data: {}
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async getAllByField(wheres) {
        if(typeof wheres == 'object') {
            return {
                package: Package.name,
                message: "",
                error: false,
                data: [
                    {}
                ]
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async getAll() {
        return {
            package: Package.name,
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
                package: Package.name,
                message: "",
                error: false
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async deleteAllByField(fields) {
        if(typeof fields == 'object') {
            return {
                package: Package.name,
                message: "",
                error: false
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async updateAll(sets,wheres) {
        if(typeof wheres == 'object' && typeof sets == 'object') {
            return {
                package: Package.name,
                message: "",
                error: false
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
    }

    async truncate() {
        return {
            package: Package.name,
            message: "",
            error: false
        }
    }

    async execute(request) {
        if(typeof request == 'string') {
            return {
                package: Package.name,
                message: "",
                error: false
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
        
    }
    
    async insert(fields) {
        if(typeof fields == 'object') {
            return {
                package: Package.name,
                message: "",
                error: false
            }
        } else {
            return {
                package: Package.name,
                message: "Invalid parameter",
                error: true
            }
        }
        
    }

}

export default Connector