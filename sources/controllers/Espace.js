import Controller from "./Controller"
import Tracing from "../utils/Tracing"

class Espace extends Controller {

    async getAll() {
        try {
            return this.sqlEspace.getAll()
        } catch (error) {
            Tracing.error("Espace : " + error.toString())
            return {
                package: Package.name,
                error: true,
                message: "Internal server error"
            }
        }
    }

}

export default Espace