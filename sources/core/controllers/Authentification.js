import Jwt from './tools/Jwt'
import md5 from "md5"
import Controller from "./Controller"
import Package from '../package.json'

class Authentification extends Controller {

    async getAll() {
        return this.sqlAuthorization.getAll()
    }

    async getAllAuthorizationByProfile(idprofile) {
        let authorizationRequest = await this.sqlAuthorization.getAll()
        if (authorizationRequest.error) {
            return authorizationRequest
        } else {
            let authorizationProfileRequest = await this.sqlAuthorizationProfile.getAllByField({ profile: idprofile })
            if (authorizationProfileRequest.error) {
                return authorizationProfileRequest
            } else {
                let tmp = []
                authorizationRequest.data.forEach(authorization => {
                    let flag = false
                    authorizationProfileRequest.data.forEach(authorizationProfile => {
                        if (authorization.id === authorizationProfile.authorization) {
                            flag = true
                            tmp.push({
                                id: authorization.id,
                                reference: authorization.reference,
                                method: authorization.method,
                                secure: 1
                            })
                        }
                    })
                    if (flag === false) {
                        tmp.push({
                            id: authorization.id,
                            reference: authorization.reference,
                            method: authorization.method,
                            secure: 0
                        })
                    }
                })
                return {
                    data: tmp,
                    package: Package.name,
                    message: ''
                }
            }
        }

    }

    async checkAuthorization(request = {}) {
        let authorization = request.headers['authorization']
        if(authorization == undefined) {
            authorization = "Bearer aaaa.bbbb.cccc"
        }
        let authorizationSplit = authorization.split(" ")
        if(authorizationSplit.length != 2) {
            return {
                error: true,
                message: "Jwt Token invalid",
                package: Package.name
            }
        }
        if(authorizationSplit[0] != "Bearer") {
            return {
                error: true,
                message: "Jwt Token invalid",
                package: Package.name
            }
        }
        let token = authorizationSplit[1]
        let resultRequest = await this.sqlAuthorization.getOneByField({
            reference: request.url,
            method: request.method
        })
        if (resultRequest.error) {
            this.core.logger.warning(Package.name, resultRequest.message + request.method + " " + request.url)
            return {
                error: true,
                message: resultRequest.messsage + " " + request.method + " " + request.url,
                package: Package.name
            }
        }
        if (resultRequest.data == false) {
            await this.sqlAuthorization.insert({
                id: null,
                reference: request.url,
                method: request.method,
                secure: '1'
            })
            resultRequest = await this.sqlAuthorization.getOneByField({
                reference: request.url,
                method: request.method
            })
        }
        if (resultRequest.data.secure === 0) {
            return {
                error: false,
                message: 'ok',
                package: Package.name
            }
        }
        let resultJwt = Jwt.verifyAccessToken(token, this.core.configuration.token)
        if (resultJwt.valid) {
            let jwt = resultJwt.login.split("~")
            let userRequest = await this.sqlUser.getOneByField({
                login: jwt[1]
            })
            if(jwt[0] != this.core.salt) {
                this.core.logger.warning(Package.name, "Jwt Token invalid")
                return {
                    error: true,
                    message: "Jwt Token invalid",
                    package: Package.name
                }
            }
            if (userRequest.error) {
                return userRequest
            } else {
                if (userRequest.data) {
                    let resultAuthorizationProfile = await this.sqlAuthorizationProfile.getOneByField({
                        profile: userRequest.data.profile,
                        authorization: resultRequest.data.id
                    })
                    if (resultAuthorizationProfile.error) {
                        return resultAuthorizationProfile
                    } else {
                        if (resultAuthorizationProfile.data) {
                            return {
                                error: false,
                                message: 'ok',
                                package: Package.name,
                                profile: userRequest.data.profile,
                                user: userRequest.data.id
                            }
                        } else {
                            this.core.logger.warning(Package.name, "Forbiden")
                            return {
                                error: true,
                                message: "Forbidden",
                                package: Package.name
                            }
                        }
                    }
                } else {
                    this.core.logger.warning(Package.name, "User not found")
                    return {
                        error: true,
                        message: "User invalid",
                        package: Package.name
                    }
                }
            }
        } else {
            this.core.logger.warning(Package.name, "Jwt Token invalid")
            return {
                error: true,
                message: "Jwt Token invalid",
                package: Package.name
            }
        }
    }

    async getToken(login,password) {
        if (login && login !== "") {
            if (password && password !== "") {
                let accountRequest = await this.sqlUser.getOneByField({ login: login })
                if (accountRequest.error) {
                    return accountRequest
                } else {
                    let account = accountRequest.data
                    if (account) {
                        if (md5(password + account.salt) === account.password) {
                            return {
                                error: false,
                                message: "",
                                package: Package.name,
                                profile: account.profile,
                                token: Jwt.generateAccessToken(this.core.salt + "~" + login, this.core.configuration.token)
                            }
                        } else {
                            return {
                                error: true,
                                message: "Password is invalid",
                                package: Package.name
                            }
                        }
                    } else {
                        return {
                            error: true,
                            message: "Login is invalid",
                            package: Package.name
                        }
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "Password is empty")
                return {
                    error: true,
                    message: "Password is empty",
                    package: Package.name
                }
            }
        } else {
            this.core.logger.warning(Package.name, "Login is empty")
            return {
                error: true,
                message: "Login is empty",
                package: Package.name
            }
        }
    }

    async updateAuthorizationByProfile(id, authorization, secure) {
        let resultRequest = await this.sqlAuthorizationProfile.getOneByField({
            authorization: authorization,
            profile: id
        })
        if (resultRequest.error) {
            return resultRequest
        } else {
            if (secure === 0) {
                let deleteRequest = await this.sqlAuthorizationProfile.deleteAllByField({ profile: id, authorization: authorization })
                if (deleteRequest.error) {
                    return deleteRequest
                } else {
                    return {
                        error: false,
                        message: '',
                        package: Package.name
                    }
                }
            } else {
                if (resultRequest.data) {
                    return {
                        error: false,
                        message: '',
                        package: Package.name
                    }
                } else {
                    let insertRequest = await this.sqlAuthorizationProfile.insert({
                        id: null,
                        authorization: authorization,
                        profile: id
                    })
                    if (insertRequest.error) {
                        return insertRequest
                    } else {
                        return {
                            error: false,
                            message: '',
                            package: Package.name
                        }
                    }
                }
            }
        }
    }

}

export default Authentification