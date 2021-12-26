import Controller from "./Controller"
import Tracing from "../utils/Tracing"
import StackTrace from "../utils/StackTrace"
import Result from "../utils/Result"

class Profile extends Controller {

    async getAll() {
        try {
            return await this.sqlProfile.getAll()
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all profile")
            return new Result(Package.name, true, "Error occurred when get all profile")
        }
    }

    async getOne(idProfile) {
        try {
            return await this.sqlAuthorization.getOne(idProfile)
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get one profile")
            return new Result(Package.name, true, "Error occurred when get one profile")
        }
    }

}

export default Profile