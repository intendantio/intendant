import Controller from "./Controller"
import Tracing from "../utils/Tracing"

class Profile extends Controller {

    async getAll() {
        try {
            return await this.sqlProfile.getAll()
        } catch (error) {
            Tracing.error("Profile : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

    async getOne(idProfile) {
        try {
            return await this.sqlAuthorization.getOne(idProfile)
        } catch (error) {
            Tracing.error("Profile : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

}

export default Profile