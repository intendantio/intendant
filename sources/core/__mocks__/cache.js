import Package from '../package.json'

export default {
    inCache: {
        get: (object) => {
            return {
                error: false,
                message: "",
                cache: true,
                data: { jest: "cache" },
                package: Package.name
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
                package: Package.name
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
                package: Package.name
            }
        },
        insert: (key,value) => {
            
        }
    }
}
