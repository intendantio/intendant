import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import Package from './package.json'

class HueSensor extends SmartObject {

    constructor(settings,logger,core) {
        let configuration = require('./configuration.json')
        super(settings,logger,core,configuration)
    }


    /*
        Action
    */

    async __checkPresence(settings = {}) {
        let result = await fetch(this.settings.path + this.settings.apikey + "/sensors/" + this.settings.id)
        if(result.status == 200) {
            let resultJSON = await result.json()
            if (Array.isArray(resultJSON)) {
                let item = resultJSON.length == 0 ? "" : resultJSON[0].error
                this.logger.warning(this.key, "/checkPresence - error code " + item.type + " return")
                return {
                    error: true,
                    code: Package.name + ">checkPresence>invalidRequest>error" ,
                    message: "Invalid request " + item
                }
            } else {
                return {
                    error: false,
                    code: "ok",
                    message: "",
                    data: resultJSON
                }
            }
        } else {
            return {
                error: true,
                code: Package.name + ">checkPresence>invalidStatus>" + result.status,
                message: "Invalid status " + result.status
            }
        }
        
        
    }

}

export default HueSensor