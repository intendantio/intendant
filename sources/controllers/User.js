
import Math from './tools/Math'
import md5 from "md5"
import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Moment from 'moment'
import StackTrace from '../utils/StackTrace'
import Result from '../utils/Result'

class User extends Controller {

    async getOne(idUser) {
        try {
            let resultUser = await this.sqlUser.getOne(idUser)
            if (resultUser.error) {
                return resultUser
            }
            if (resultUser.data == false) {
                Tracing.warning(Package.name, "User not found")
                return new Result(Package.name, true, "User not found")
            }
            let user = resultUser.data
            let resultHistory = await this.sqlUserHistory.getAllByField({
                user: user.id
            })
            if (resultHistory.error) {
                return resultHistory
            }
            let resultDashboard = await this.sqlUserDashboard.getAllByField({
                user: user.id
            })
            if (resultDashboard.error) {
                return resultDashboard
            }
            user.dashboards = resultDashboard.data
            user.password = "hidden"
            user.histories = resultHistory.data
            return new Result(Package.name, false, "", user)

        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one user")
            return new Result(Package.name, true, "Error occurred when get one user")
        }
    }

    async getAll() {
        try {
            let resultUsers = await this.sqlUser.getAll()
            if (resultUsers.error) {
                return resultUsers
            }
            let users = []
            for (let indexUser = 0; indexUser < resultUsers.data.length; indexUser++) {
                let user = resultUsers.data[indexUser]
                let resultUser = await this.getOne(user.id)
                if (resultUser.error) {
                    return resultUser
                }
                users.push(user)
            }
            return new Result(Package.name, false, "", users)
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
            let resultUserHistory = this.sqlUserHistory.deleteAllByField({ user: idUser })
            if (resultUserHistory.error) {
                return resultUserHistory
            }
            let resultUser = this.sqlUser.deleteAllByField({ id: idUser })
            if (resultUser.error) {
                return resultUser
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete user")
            return new Result(Package.name, true, "Error occurred when delete user")
        }
    }

    async insert(pUser) {
        try {
            let accountRequest = await this.sqlUser.getOneByField({ login: pUser.login })
            if (accountRequest.error) {
                return accountRequest
            } else {
                let account = accountRequest.data
                if (account) {
                    Tracing.warning(Package.name, "Login already exist")
                    return new Result(Package.name, true, "Login already exist")
                } else {
                    Tracing.verbose(Package.name, "Insert user " + pUser.login)
                    let salt = Math.random(16)
                    let saltPassword = md5(pUser.password + salt)
                    let insertAccountRequest = await this.sqlUser.insert({
                        id: null,
                        login: pUser.login,
                        imei: pUser.imei,
                        password: saltPassword,
                        salt: salt,
                        profile: pUser.profile
                    })
                    if (insertAccountRequest.error) {
                        return insertAccountRequest
                    } else {
                        let idUser = insertAccountRequest.data.insertId

                        let resultHistory = this.insertHistory(idUser, "CREATE", "Initialisation")
                        if (resultHistory.error) {
                            return resultHistory
                        }
                        return new Result(Package.name, false, "")
                    }
                }
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert user")
            return new Result(Package.name, true, "Error occurred when insert user")
        }

    }

    // Type : ["CREATE","UPDATE","GET","DELETE","EXECUTE"]
    async insertHistory(idUser, type, action) {
        try {
            let resultUser = await this.getOne(idUser)
            if (resultUser.error) {
                return resultUser
            } else if (resultUser.data == false) {
                Tracing.warning(Package.name, "Missing user")
                return new Result(Package.name, true, "Missing user")
            } else {
                let timestamp = Moment().valueOf()

                let resultUserHistory = await this.sqlUserHistory.insert({
                    id: null,
                    type: type,
                    action: action,
                    user: idUser,
                    date: timestamp
                })
                if (resultUserHistory.error) {
                    return resultUserHistory
                }
                return new Result(Package.name, false, "")
            }
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert user history")
            return new Result(Package.name, true, "Error occurred when user history")
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

    async insertUserDashboard(idUser, type, object, action, x, y) {
        try {
            let resultUser = await this.getOne(idUser)
            if (resultUser.error) {
                return resultUser
            }

            let resultUserDashboard = await this.sqlUserDashboard.insert({
                user: idUser,
                object: object,
                action: action,
                type: type,
                x: x,
                y: y
            })

            if (resultUserDashboard.error) {
                return resultUserDashboard
            }

            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when insert user dashboard")
            return new Result(Package.name, true, "Error occurred when insert user dashboard")
        }
    }


    async updateUserDashboard(idUserDasboard, x, y) {
        try {
            let resultUserDashboard = await this.sqlUserDashboard.updateAll({ x: x, y: y }, { id: idUserDasboard })
            if (resultUserDashboard.error) {
                return resultUserDashboard
            }
            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when update user dashboard")
            return new Result(Package.name, true, "Error occurred when update user dashboard")
        }
    }

    async deleteUserDashboard(idUserDasboard) {
        try {
            let resultUserDashboard = await this.sqlUserDashboard.getOne(idUserDasboard)
            if (resultUserDashboard.error) {
                return resultUserDashboard
            }
            if (resultUserDashboard.data == false) {
                Tracing.warning(Package.name, "User dashboard not found")
                return new Result(Package.name, true, "User dashboard not found")
            }

            let resultDeleteDashboard = await this.sqlUserDashboard.deleteOne(idUserDasboard)

            if (resultDeleteDashboard.error) {
                return resultDeleteDashboard
            }

            return new Result(Package.name, false, "")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when delete user dashboard")
            return new Result(Package.name, true, "Error occurred when delete user dashboard")
        }
    }

    async updateProfile(idUser, profile) {
        try {
            let resultUser = await this.getOne(idUser)
            if (resultUser.error) {
                return resultUser
            }
            if (resultUser.data.login == "admin") {
                Tracing.warning(Package.name, "Cannot update admin")
                return new Result(Package.name, true, "Cannot update admin")
            }

            let userRequest = await this.sqlUser.updateAll({ profile: profile }, { id: idUser })
            if (userRequest.error) {
                return userRequest
            } else {
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
            let result = new Result(Package.name, false, "")
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