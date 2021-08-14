import Package from '../package.json'

export default {
    inCache: {
        get: (object) => {
            return {
                error: false,
                message: "",
                cache: true,
                data: { jest: "cache" },
                code: "ok"
            }
        },
        insert: (key,value) => {

        }
    },
    notInCache: {
        get: (object) => {
            return {
                error: false,
                message: "",
                cache: false,
                data: false,
                code: "ok"
            }
        },
        insert: (key,value) => {
            
        }
    },
    errorInCache: {
        get: (object) => {
            return {
                error: true,
                message: "jest-error",
                cache: false,
                code: Package.name + ">get>jest-error"
            }
        },
        insert: (key,value) => {
            
        }
    }
}
