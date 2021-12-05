import Controller from "./Controller"

class Espace extends Controller {

    async getAll() {
        try {
            return this.sqlEspace.getAll()
        } catch (error) {
            this.core.logger.error("Espace : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

}

export default Espace