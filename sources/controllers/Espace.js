import Controller from "./Controller"
import StackTrace from "../utils/StackTrace"
import Tracing from "../utils/Tracing"
import Result from "../utils/Result"

class Espace extends Controller {

    async getAll() {
        try {
            return this.sqlEspace.getAll()
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when get all espace")
            return new Result(Package.name, true, "Error occurred when get all espace")
        }
    }

}

export default Espace