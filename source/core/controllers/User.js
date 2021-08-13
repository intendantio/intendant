
import Math from './tools/Math'
import md5 from "md5"
import Controller from "./Controller"
import Package from '../package.json'

class User extends Controller {

    async getOne(id) {
        return await this.sqlUser.getOne(id)
    }

    async getAll() {
        let result = await this.sqlUser.getAll()
        if (result.error == false) {
            let data = result.data.map(user => {
                user.password = ""
                return user
            })
            result.data = data
        }
        return result
    }

    async delete(idUser) {
        let resultUserAdmin = await this.sqlUser.getOne(idUser)
        if (resultUserAdmin.error) {
            return resultUserAdmin
        }
        if (resultUserAdmin.data == false) {
            this.core.logger.warning(Package.name, "User not found")
            return {
                error: true,
                message: "User invalid",
                code: Package.name + '>User>NotFound'
            }
        }
        if (resultUserAdmin.data.login == "admin") {
            this.core.logger.warning(Package.name, "Cannot delete admin")
            return {
                error: true,
                message: "Cannot delete admin",
                code: Package.name + '>User>CantAdmin'
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
            code: "ok"
        }
    }

    async insert(login, password, profile = '2') {
        if (login && login !== "") {
            if (password && password !== "") {
                let accountRequest = await this.sqlUser.getOneByField({ login: login })
                if (accountRequest.error) {
                    return accountRequest
                } else {
                    let account = accountRequest.data
                    if (account) {
                        this.core.logger.warning(Package.name, "Login is already register")
                        return {
                            error: true,
                            message: "Login is already register",
                            code: "authentification-already-register"
                        }
                    } else {
                        this.core.logger.verbose(Package.name, "Insert user " + login)
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
                                code: "ok"
                            }
                        }
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "Password is empty")
                return {
                    error: true,
                    message: "Password is empty",
                    code: "authentification-password-empty"
                }
            }
        } else {
            this.core.logger.warning(Package.name, "Login is empty")
            return {
                error: true,
                message: "Login is empty",
                code: "authentification-login-empty"
            }
        }
    }

    async insertAdmin(password) {
        let result = await this.getStarted()
        if (result.getStarted) {
            if (password && typeof password == 'string' && password.length >= 4) {
                return this.insert("admin", password, '1')
            } else {
                return {
                    error: Package.name + ">Missing>Password",
                    message: "Missing password"
                }
            }
        } else {
            return {
                error: Package.name + ">Invalid>CycleState",
                message: "Invalid cycle state"
            }
        }
    }

    async update(id, login, profile) {
        if (login) {
            if (profile) {
                let result = await this.sqlUser.getOne(id)
                if (result.error) {
                    return result
                }
                let user = result.data
                if (user.login != login) {
                    let resultUser = this.sqlUser.updateAll({ login: login }, { id: id })
                    if (resultUser.error) {
                        return result
                    }
                }
                if (user.profile != profile) {
                    let resultProfile = this.sqlUser.updateAll({ profile: profile }, { id: id })
                    if (resultProfile.error) {
                        return result
                    }
                }
                return {
                    error: false,
                    message: "",
                    code: "ok"
                }
            } else {
                return {
                    error: Package.name + ">Missing>Profile",
                    message: "Missing profile"
                }
            }
        } else {
            return {
                error: Package.name + ">Missing>Login",
                message: "Missing login"
            }
        }
    }

    async updatePassword(id, password) {
        let salt = Math.random(16)
        let userRequest = await this.sqlUser.updateAll({ password: md5(password + salt) }, { id: id })
        if (userRequest.error) {
            return userRequest
        } else {
            let saltRequest = await this.sqlUser.updateAll({ salt: salt }, { id: id })
            if (saltRequest.error) {
                return saltRequest
            }
            return {
                error: false,
                message: "",
                code: "ok"
            }
        }
    }

    async getStarted() {
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
    }

}

export default User