
import Math from './tools/Math'
import md5 from "md5"
import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import StackTrace from '../utils/StackTrace'
import Result from '../utils/Result'

class User extends Controller {

    async getOne(idUser) {
        try {
            return await this.sqlUser.getOne(idUser)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one user")
            return new Result(Package.name, true, "Error occurred when get one user")
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
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all user")
            return new Result(Package.name, true, "Error occurred when get all user")
        }
    }

    async delete(idUser) {
        try {
            let resultUserAdmin = await this.sqlUser.getOne(idUser)
            if (resultUserAdmin.error) {
                return resultUserAdmin
            }
            if (resultUserAdmin.data == false) {
                Tracing.warning(Package.name, "Invalid user")
                return new Result(Package.name, true, "Invalid user")
            }
            if (resultUserAdmin.data.login == "admin") {
                Tracing.warning(Package.name, "Cannot delete admin")
                return new Result(Package.name, true, "Cannot delete admin")
            }
            let resultClient = this.sqlClient.deleteAllByField({ user: idUser })
            if (resultClient.error) {
                return resultClient
            }
            let resultUser = this.sqlUser.deleteAllByField({ id: idUser })
            if (resultUser.error) {
                return resultUser
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete one user")
            return new Result(Package.name, true, "Error occurred when delete one user")
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
                            Tracing.warning(Package.name, "Login already exist")
                            return new Result(Package.name, true, "Login already exist")
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
                                return new Result(Package.name, false, "")
                            }
                        }
                    }
                } else {
                    Tracing.warning(Package.name, "Empty password")
                    return new Result(Package.name, true, "Empty password")
                }
            } else {
                Tracing.warning(Package.name, "Empty login")
                return new Result(Package.name, true, "Empty login")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert user")
            return new Result(Package.name, true, "Error occurred when insert user")
        }

    }

    async insertAdmin(password) {
        try {
            let result = await this.getStarted()
            if (result.getStarted) {
                if (password && typeof password == 'string') {
                    if(password.length >= 4) {
                        return this.insert("admin", password, '1')
                    } else {
                        Tracing.warning(Package.name, "Too small password")
                        return new Result(Package.name, true, "Too small password")
                    }
                } else {
                    Tracing.warning(Package.name, "Invalid password")
                    return new Result(Package.name, true, "Invalid password")
                }
            } else {
                Tracing.warning(Package.name, "Invalid cycle state")
                return new Result(Package.name, true, "Invalid cycle state")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert admin")
            return new Result(Package.name, true, "Error occurred when insert admin")
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
                    return new Result(Package.name, false, "")
                } else {
                    return new Result(Package.name, true, "Missing profile")
                }
            } else {
                return new Result(Package.name, true, "Missing login")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update user")
            return new Result(Package.name, true, "Error occurred when update user")
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
                return new Result(Package.name, false, "")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update password")
            return new Result(Package.name, true, "Error occurred when update password")
        }

    }

    async getStarted() {
        try {
            let resultUser = await this.sqlUser.getOneByField({ login: "admin" })
            if (resultUser.error) {
                return resultUser
            }
            let result = new Result(Package.name,false,"")
            if (resultUser.data == false) {
                result.getStarted = true
            } else {
                result.getStarted = false
            }
            return result
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get started")
            return new Result(Package.name, true, "Error occurred when get started")
        }

    }

}

export default User