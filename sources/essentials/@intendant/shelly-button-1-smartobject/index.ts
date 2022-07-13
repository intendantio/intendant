import SmartObject from '../../smartobject'
import Package from './package.json'
import Product from './products.json'
import Docs from './docs.json'

class ShellyButton extends SmartObject {

    async prepare() {



    }

    async getStatus(settings = {}) {
        return {
            error: false,
            package: Package.name,
            message: "",
            data: {
                status: "SUCCESS",
                reason: ""
            }
        }
    }

    async __url(settings = {}) {
        let result = await this.core.controller.authentification.getSingleCode(this.id)
        if(result.error) {
            return result
        }
        return {
            error: false,
            message: "",
            data: {
                message: "Add this url into your 'Shelly dashboard' in I/O actions",
                url: process.env.PUBLIC_CLOUD + "/api/smartobjects/" + this.id + "/actions/updateState?code=" + result.data.code
            }
        }
    }

    async __updateState(settings = {}) {
        return {
            error: false,
            message: "",
            data: {
                message: ""
            }
        }
    }


}

export default ShellyButton