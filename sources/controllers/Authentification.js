import Jwt from './tools/Jwt'
import md5 from "md5"
import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from "../utils/Result"
import StackTrace from '../utils/StackTrace'

class Authentification extends Controller {

    constructor(token, salt) {
        super()
        this.token = token
        this.salt = salt
    }

    async getAll() {
        try {
            return await this.sqlAuthorization.getAll()
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all authorization")
            return new Result(Package.name, true, "Error occurred when get all authorization")
        }
    }

    async getAllAuthorizationByProfile(idprofile) {
        try {
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
                    return new Result(Package.name, false, "", tmp)
                }
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all authorization by profile")
            return new Result(Package.name, true, "Error occurred when get all authorization by profile")
        }
    }

    async checkAuthorization(request = {}) {
        try {
            let authorization = request.headers['authorization']
            if (authorization == undefined) {
                authorization = "Bearer aaaa.bbbb.cccc"
            }
            let authorizationSplit = authorization.split(" ")
            if (authorizationSplit.length != 2) {
                return new Result(Package.name, true, "Invalid token")
            }
            if (authorizationSplit[0] != "Bearer") {
                return new Result(Package.name, true, "Invalid token")
            }
            let token = authorizationSplit[1]
            let resultRequest = await this.sqlAuthorization.getOneByField({
                reference: request.url,
                method: request.method
            })
            if (resultRequest.error) {
                return resultRequest
            }
            if (resultRequest.data == false) {
                let resultInsert = await this.sqlAuthorization.insert({
                    id: null,
                    reference: request.url,
                    method: request.method,
                    secure: '1'
                })
                if (resultInsert.error) {
                    return resultRequest
                }
                let resultGetOne = await this.sqlAuthorization.getOneByField({
                    reference: request.url,
                    method: request.method
                })
                if (resultGetOne.error) {
                    return resultGetOne
                }
            }
            if (resultRequest.data.secure === 0) {
                return new Result(Package.name, false, "")
            }
            let resultJwt = Jwt.verifyAccessToken(token, this.token)
            if (resultJwt.valid) {
                let jwt = resultJwt.login.split("~")
                let userRequest = await this.sqlUser.getOneByField({
                    login: jwt[1]
                })
                if (jwt[0] == "anonymous") {
                    let result = new Result(Package.name, false, "")
                    result.profile = 1
                    result.user = 1
                    return result
                }
                if (jwt[0] != this.salt) {
                    return new Result(Package.name, true, "Invalid token")
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
                                let result = new Result(Package.name, false, "")
                                result.profile = userRequest.data.profile
                                result.user = userRequest.data.id
                                return result
                            } else {
                                Tracing.warning(Package.name, "Forbidden")
                                return new Result(Package.name, true, "Forbidden")
                            }
                        }
                    } else {
                        Tracing.warning(Package.name, "Invalid user")
                        return new Result(Package.name, true, "Invalid user")
                    }
                }
            } else {
                Tracing.warning(Package.name, "Invalid token")
                return new Result(Package.name, true, "Invalid token")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when check authorization")
            return new Result(Package.name, true, "Error occurred when check authorization")
        }
    }

    async getToken(login, password) {
        try {
            if (login && login !== "") {
                if (password && password !== "") {
                    let accountRequest = await this.sqlUser.getOneByField({ login: login })
                    if (accountRequest.error) {
                        return accountRequest
                    } else {
                        let account = accountRequest.data
                        if (account) {
                            if (md5(password + account.salt) === account.password) {
                                let result = new Result(Package.name, false, "")
                                result.profile = account.profile
                                result.token = Jwt.generateAccessToken(this.salt + "~" + login, this.token)
                                return result
                            } else {
                                Tracing.warning(Package.name, "Invalid password")
                                return new Result(Package.name, true, "Invalid password")
                            }
                        } else {
                            Tracing.warning(Package.name, "Invalid login")
                            return new Result(Package.name, true, "Invalid login")
                        }
                    }
                } else {
                    Tracing.warning(Package.name, "Password is empty")
                    return new Result(Package.name, true, "Password is empty")
                }
            } else {
                Tracing.warning(Package.name, "Login is empty")
                return new Result(Package.name, true, "Login is empty")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get token")
            return new Result(Package.name, true, "Error occurred when get token")
        }
    }

    async updateAuthorizationByProfile(id, authorization, secure) {
        try {
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
                        return new Result(Package.name, false, "")
                    }
                } else {
                    if (resultRequest.data) {
                        return new Result(Package.name, false, "")
                    } else {
                        let insertRequest = await this.sqlAuthorizationProfile.insert({
                            id: null,
                            authorization: authorization,
                            profile: id
                        })
                        if (insertRequest.error) {
                            return insertRequest
                        } else {
                            return new Result(Package.name, false, "")
                        }
                    }
                }
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update authorization")
            return new Result(Package.name, true, "Error occurred when update authorization")
        }
    }

    async getAnonymousToken(service) {
        try {
            return new Result(Package.name, false, "", Jwt.generateAccessToken("anonymous~" + service, this.token))
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get token")
            return new Result(Package.name, true, "Error occurred when get token")
        }
    }

}

export default Authentification