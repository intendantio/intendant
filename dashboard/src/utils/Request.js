import Package from '../../package.json'
import Moment from 'moment'
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

    patch(data = {}) {
        this.method = 'PATCH'
        this.data = data
        return this
    }

    put(data) {
        this.method = 'PUT'
        this.data = data
        return this
    }



    async fetch(url) {
        
        let expiry = parseInt(localStorage.getItem("expiry"))
        let server = localStorage.getItem("server")
        //Moment().add({ minutes: 5 }).valueOf()
        if (expiry < Moment().valueOf()) {
            let resultRefresh = await this.refreshToken()
            if(resultRefresh.error) {
                return resultRefresh
            }
        }

        let accessToken = localStorage.getItem("access_token")

        try {
            let result = await fetch(server + url, {
                method: this.method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: this.method == 'POST' || this.method == 'PATCH' || this.method == 'PUT' ? JSON.stringify(this.data) : null
            })
            return await result.json()
        } catch (error) {
            return {
                error: true,
                message: "An error has occurred",
                package: Package.name
            }
        }
    }

    async refreshToken() {
        let refreshToken = localStorage.getItem("refresh_token")
        let server = localStorage.getItem("server")

        let result = await fetch(server + "/api/authentification", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: refreshToken })
        })
        let resultJSON = await result.json()
        if(resultJSON.error) {
            return {
                package: Package.name,
                error: true,
                message: resultJSON.message
            }
        }

        localStorage.setItem("access_token", resultJSON.data.access_token)
        localStorage.setItem("expiry", resultJSON.data.expiry + "")

        return {
            package: Package.name,
            error: false,
            message: ""
        }

    }

}

export default Request