class Result {

    public package: String
    public error: Boolean
    public message: String
    public data: any
    public cache?: boolean
    public getStarted?: boolean

    constructor(pPackage,error,message,data = {}) {
        this.package = pPackage
        this.error = error
        this.message = message
        this.data = data
    }

}

export default Result