import Controller from "./Controller"
import Package from '../package.json'

class Espace extends Controller {

    async getAll() {
        return this.sqlEspace.getAll()
    }

}

export default Espace