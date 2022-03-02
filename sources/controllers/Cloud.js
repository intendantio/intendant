import Controller from "./Controller";
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from "../utils/Result"
import Utils from "../utils/Utils"
import StackTrace from "../utils/StackTrace";

class Cloud extends Controller {

    async register() {

    }


    async getSingleCode(idSmartobject) {
        let resultSmartobject = await this.sqlSmartobject.getOne(idSmartobject) 

        if(resultSmartobject.error) {
            return resultSmartobject
        }

        if(resultSmartobject.data == false) {
            return new Result(Package.name,true,"")
        }

        let getOneSingleCode = await this.sqlSingleCode.getOneByField({ smartobject: idSmartobject })
        if (getOneSingleCode.error) {
            return getOneSingleCode
        }
        let singleCode = getOneSingleCode.data
        if (singleCode == false) {
            let exist = true
            let code = ""
            while (exist) {
                code = Utils.generateSingleCodeUnique()
                let resultCountCode = await this.sqlSingleCode.count({ code: code })
                if (resultCountCode.error) {
                    return resultCountCode
                }
                if (resultCountCode.data.count == 0) {
                    exist = false
                }
            }
            let insertCode = await this.sqlSingleCode.insert({ smartobject: idSmartobject, code: code })
            if (insertCode.error) {
                return insertCode
            }
            singleCode = {
                code: code,
                smartobject: idSmartobject
            }
        }
        return new Result(Package.name, false, "", singleCode)
    }

}

export default Cloud