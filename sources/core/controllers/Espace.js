import Controller from "./Controller"

class Espace extends Controller {

    async getAll() {
        return this.sqlEspace.getAll()
    }

}

export default Espace