import SmartObject from '../../smartobject'
import fetch from 'node-fetch'
import Package from './package.json'
import Product from './products.json'
import Docs from './docs.json'

class LaMetric extends SmartObject {

    async prepare() {}

    async getStatus(settings = {}) {
        let result = await fetch("https://developer.lametric.com/api/v2/icons?page_size=4")
        if(result.status == 200) {
            return {
                error: false,
                package: Package.name,
                message: "",
                data: {
                    status: "SUCCESS",
                    reason: ""
                }
            }
        } else {
            return {
                error: false,
                package: Package.name,
                message: "",
                data: {
                    status: "ERROR",
                    reason: ""
                }
            }
        }
    }

    /*
        Action
    */
    async __authentification(settings = {}) {
        let result = await this.core.controller.authentification.getSingleCode(this.id)
        return {
            error: false,
            message: "",
            data: {
                message: "Add this field into your 'Intendant button' application on LaMetric app",
                smartobject: this.id,
                code: result.data.code
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

export default LaMetric