declare class Result {

    constructor(package: String, error: Boolean, message: String, data? : Object)

    public package: String
    public error: Boolean
    public message: String
    public data?: Object
}

export default Result