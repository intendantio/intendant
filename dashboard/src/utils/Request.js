class Request {

    constructor() {
        this.method = 'GET'
    }

    post(data) {
        this.method = 'POST'
        this.data = data
        return this
    }

    get() {
        this.method = 'GET'
        return this
    }

    delete() {
        this.method = 'DELETE'
        return this
    }

    put(data) {
        this.method = 'PUT'
        this.data = data
        return this
    }

    async fetch(url) {
        let authorization = localStorage.getItem("authorization")
        let server = localStorage.getItem("server")
        try {
            let result = await fetch(server + url, {
                method: this.method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': authorization
                },
                body: this.method == 'POST' || this.method == 'PUT' ? JSON.stringify(this.data) : null
            })
            return await result.json()
        } catch (error) {
            return {
                error: true,
                message: "An error has occurred"
            }
        }
    }

}

export default Request