import Jwt from './tools/Jwt'
import md5 from "md5"
import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from "../utils/Result"
import StackTrace from '../utils/StackTrace'
import Moment from 'moment'
import Scope from '../scope.json'

class Authentification extends Controller {

    async getAll() {
        try {
            return await this.sqlAuthorization.getAll()
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all authorization")
            return new Result(Package.name, true, "Error occurred when get all authorization")
        }
    }

    async checkSingleCode(code, url, params) {
        let resultQuery = await this.sqlSingleCode.getOneByField({ code: code })
        if (resultQuery.error) {
            return resultQuery
        }
        if (resultQuery.data == false) {
            Tracing.warning(Package.name, "Invalid single code authorization")
            return new Result(Package.name, true, "Invalid single code authorization")
        }
        let splitRequest = url.split("/")
        if (splitRequest[1] == "smartobjects" && params.idSmartobject) {
            let singleCode = resultQuery.data
            let idSmartobject = parseInt(params.idSmartobject)
            if (parseInt(singleCode.smartobject) == idSmartobject) {
                return new Result(Package.name, false, "", {
                    idProfile: false
                })
            } else {
                Tracing.warning(Package.name, "Invalid method to single code")
                return new Result(Package.name, true, "Invalid method to single code")
            }
        } else {
            Tracing.warning(Package.name, "Invalid single code authorization")
            return new Result(Package.name, true, "Invalid single code authorization")
        }
    }

    getScope(url, method) {
        if (Scope[method] == undefined) {
            Tracing.warning(Package.name, "Invalid method")
            return new Result(Package.name, true, "Invalid method")
        }

        if (Scope[method][url] == undefined || Array.isArray(Scope[method][url]) == false) {
            Tracing.warning(Package.name, "Missing url " + method + ":" + url)
            return new Result(Package.name, true, "Invalid url")
        }


        return new Result(Package.name, false, "", Scope[method][url])
    }

    async checkAuthorization(request) {
        try {
            let resultScope = this.getScope(request.url, request.method)

            if (resultScope.error) {
                return resultScope
            }

            let currentScope = resultScope.data

            if (currentScope.includes("public")) {
                return new Result(Package.name, false, "")
            } else {
                if (request.query.code) {
                    return this.checkSingleCode(request.query.code, request.url, request.params)
                } else {
                    let authorization = request.headers['authorization']
                    if (authorization == undefined) {
                        return new Result(Package.name, true, "Missing Bearer token")
                    }

                    let authorizationSplit = authorization.split(" ")
                    if (authorizationSplit.length != 2 || authorizationSplit[0] != "Bearer") {
                        return new Result(Package.name, true, "Wrong Bearer token")
                    }
                    let bearerToken = authorizationSplit[1]

                    let resultToken = Jwt.verifyAccessToken(bearerToken, this.token)
                    if (resultToken.error) {
                        return resultToken
                    }

                    let token = resultToken.data

                    if (Moment().valueOf() > token.exp) {
                        Tracing.warning(Package.name, "Expired Bearer token")
                        return new Result(Package.name, true, "Expired Bearer token")
                    }

                    let resultUser = await this.sqlUser.getOneByField({ login: token.sub })
                    if (resultUser.error) {
                        return resultUser
                    }

                    if (resultUser.data == false) {
                        Tracing.warning(Package.name, "Invalid user")
                        return new Result(Package.name, true, "Invalid user")
                    }
                    let user = resultUser.data

                    let resultProfile = await this.sqlProfile.getOne(user.profile)

                    if (resultProfile.error) {
                        return resultProfile
                    } else if (resultProfile.data == false) {
                        Tracing.warning(Package.name, "Invalid profile")
                        return new Result(Package.name, true, "Invalid profile")
                    }

                    let profile = resultProfile.data

                    let isAvailable = currentScope.includes(profile.scope)
                    if (isAvailable == false) {
                        Tracing.warning(Package.name, request.url + " was not available in " + profile.scope + " scope")
                        return new Result(Package.name, true, "Forbidden method")
                    }

                    return new Result(Package.name, false, "", {
                        idProfile: profile.id
                    })
                }
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when check authorization")
            return new Result(Package.name, true, "Error occurred when check authorization")
        }
    }

    async getTokenWithRefresh(refresh) {
        try {
            let result = await Jwt.verifyAccessToken(refresh, this.token)

            if (result.error) {
                return result
            }

            let resultToken = await Jwt.verifyAccessToken(result.data.sub, this.token)

            if (resultToken.error) {
                return resultToken
            }

            let accountRequest = await this.sqlUser.getOneByField({ login: resultToken.data.sub })
            if (accountRequest.error) {
                return accountRequest
            }

            if (accountRequest.data && parseInt(accountRequest.data.profile) == parseInt(resultToken.data.profile)) {

                let token = resultToken.data
                let expiry = Moment().add({ minutes: 30 }).valueOf()
                token.exp = expiry

                let newToken = await Jwt.generateAccessToken(token, this.token)

                if (newToken.error) {
                    return newToken
                }

                return new Result(Package.name, false, "", {
                    access_token: newToken.data,
                    expiry: expiry
                })
            } else {
                Tracing.warning(Package.name, "Invalid user")
                return new Result(Package.name, true, "Invalid user")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get token")
            return new Result(Package.name, true, "Error occurred when get token")
        }
    }

    async getToken(login, password) {
        try {
            let accountRequest = await this.sqlUser.getOneByField({ login: login })
            if (accountRequest.error) {
                return accountRequest
            }
            let account = accountRequest.data
            if (account) {
                if (md5(password + account.salt) === account.password) {

                    let expiry = Moment().add({ minutes: 30 }).valueOf()
                    let payload = JSON.stringify({ sub: login, exp: expiry, profile: account.profile })

                    let resultAcessToken = Jwt.generateAccessToken(payload, this.token)
                    if (resultAcessToken.error) {
                        return resultAcessToken
                    }

                    let payloadRefresh = JSON.stringify({ sub: resultAcessToken.data })
                    let resultRefreshToken = Jwt.generateAccessToken(payloadRefresh, this.token)
                    if (resultRefreshToken.error) {
                        return resultRefreshToken
                    }

                    return new Result(Package.name, false, "", {
                        profile: account.profile,
                        access_token: resultAcessToken.data,
                        refresh_token: resultRefreshToken.data,
                        expiry: expiry
                    })

                } else {
                    Tracing.warning(Package.name, "Invalid password")
                    return new Result(Package.name, true, "Invalid password")
                }
            } else {
                Tracing.warning(Package.name, "Invalid login")
                return new Result(Package.name, true, "Invalid login")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get token")
            return new Result(Package.name, true, "Error occurred when get token")
        }
    }


}

export default Authentification