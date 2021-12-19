
import Math from './tools/Math'
import md5 from "md5"
import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"

class User extends Controller {

    async getOne(idUser) {
        try {
            return await this.sqlUser.getOne(idUser)
        } catch (error) {
            Tracing.error(Package.name,"User : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async getAll() {
        try {
            let result = await this.sqlUser.getAll()
            if (result.error == false) {
                let data = result.data.map(user => {
                    user.password = ""
                    return user
                })
                result.data = data
            }
            return result
        } catch (error) {
            Tracing.error(Package.name,"User : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async delete(idUser) {
        try {
            let resultUserAdmin = await this.sqlUser.getOne(idUser)
            if (resultUserAdmin.error) {
                return resultUserAdmin
            }
            if (resultUserAdmin.data == false) {
                Tracing.warning(Package.name, "User not found")
                return {
                    error: true,
                    message: "User invalid",
                    package: Package.name
                }
            }
            if (resultUserAdmin.data.login == "admin") {
                Tracing.warning(Package.name, "Cannot delete admin")
                return {
                    error: true,
                    message: "Cannot delete admin",
                    package: Package.name
                }
            }
            let resultClient = this.sqlClient.deleteAllByField({ user: idUser })
            if (resultClient.error) {
                return resultClient
            }
            let resultUser = this.sqlUser.deleteAllByField({ id: idUser })
            if (resultUser.error) {
                return resultUser
            }
            return {
                error: false,
                message: "",
                package: Package.name
            }
        } catch (error) {
            Tracing.error(Package.name,"User : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async insert(login, password, profile = '2') {
        try {
            if (login && login !== "") {
                if (password && password !== "") {
                    let accountRequest = await this.sqlUser.getOneByField({ login: login })
                    if (accountRequest.error) {
                        return accountRequest
                    } else {
                        let account = accountRequest.data
                        if (account) {
                            Tracing.warning(Package.name, "Login is already register")
                            return {
                                error: true,
                                message: "Login is already register",
                                package: Package.name
                            }
                        } else {
                            Tracing.verbose(Package.name, "Insert user " + login)
                            let salt = Math.random(16)
                            let saltPassword = md5(password + salt)
                            let insertAccountRequest = await this.sqlUser.insert({
                                id: null,
                                login: login,
                                password: saltPassword,
                                salt: salt,
                                profile: profile
                            })
                            if (insertAccountRequest.error) {
                                return insertAccountRequest
                            } else {
                                return {
                                    error: false,
                                    message: "",
                                    package: Package.name
                                }
                            }
                        }
                    }
                } else {
                    Tracing.warning(Package.name, "Password is empty")
                    return {
                        error: true,
                        message: "Password is empty",
                        package: Package.name
                    }
                }
            } else {
                Tracing.warning(Package.name, "Login is empty")
                return {
                    error: true,
                    message: "Login is empty",
                    package: Package.name
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"User : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async insertAdmin(password) {
        try {
            let result = await this.getStarted()
            if (result.getStarted) {
                if (password && typeof password == 'string' && password.length >= 4) {
                    return this.insert("admin", password, '1')
                } else {
                    return {
                        error: Package.name,
                        message: "Missing password"
                    }
                }
            } else {
                return {
                    error: Package.name,
                    message: "Invalid cycle state"
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"User : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async update(idUser, login, profile) {
        try {
            if (login) {
                if (profile) {
                    let result = await this.sqlUser.getOne(idUser)
                    if (result.error) {
                        return result
                    }
                    let user = result.data
                    if (user.login != login) {
                        let resultUser = this.sqlUser.updateAll({ login: login }, { id: idUser })
                        if (resultUser.error) {
                            return result
                        }
                    }
                    if (user.profile != profile) {
                        let resultProfile = this.sqlUser.updateAll({ profile: profile }, { id: idUser })
                        if (resultProfile.error) {
                            return result
                        }
                    }
                    return {
                        error: false,
                        message: "",
                        package: Package.name
                    }
                } else {
                    return {
                        error: Package.name,
                        message: "Missing profile"
                    }
                }
            } else {
                return {
                    error: Package.name,
                    message: "Missing login"
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"User : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async updatePassword(idUser, password) {
        try {
            let salt = Math.random(16)
            let userRequest = await this.sqlUser.updateAll({ password: md5(password + salt) }, { id: idUser })
            if (userRequest.error) {
                return userRequest
            } else {
                let saltRequest = await this.sqlUser.updateAll({ salt: salt }, { id: idUser })
                if (saltRequest.error) {
                    return saltRequest
                }
                return {
                    error: false,
                    message: "",
                    package: Package.name
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"User : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

    async getStarted() {
        try {
            let resultUser = await this.sqlUser.getOneByField({ login: "admin" })
            if (resultUser.error) {
                return resultUser
            }
            if (resultUser.data == false) {
                return {
                    error: false,
                    message: "",
                    getStarted: true
                }
            } else {
                return {
                    error: false,
                    message: "",
                    getStarted: false
                }
            }
        } catch (error) {
            Tracing.error(Package.name,"User : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }

    }

}

export default User