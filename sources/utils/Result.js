class Result {

    constructor(pPackage,error,message,data = {}) {
        this.package = pPackage
        this.error = error
        this.message = message
        this.data = data
    }

}

export default Result