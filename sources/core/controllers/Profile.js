import Controller from "./Controller"

class Profile extends Controller {

    async getAll() {
        return await this.sqlProfile.getAll()
    }

    async getOne(idProfile) {
        return await this.sqlAuthorization.getOne(idProfile)
    }

}

export default Profile