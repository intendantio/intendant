class Parser {

    static stringify(value) {
        try {
            switch (typeof value) {
                case 'string':
                case 'number':
                    return value
                case 'object':
                case 'boolean':
                    return JSON.stringify(value)
                case 'undefined':
                case 'symbol':
                case 'function':
                    return ""
            }
        } catch (error) {
            return ""
        }
    }

    static parse(value) {
        try {
            return JSON.parse(value)
        } catch (error) {
            return value
        }
    }

}

export default Parser