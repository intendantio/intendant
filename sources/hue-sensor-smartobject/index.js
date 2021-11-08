import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import Package from './package.json'

class HueSensor extends SmartObject {

    constructor(settings,logger,core) {
        super(settings,logger,core,Package)
    }


    /*
        Action
    */

    async __checkPresence(settings = {}) {
        let result = await fetch("http://" + this.settings.path + "/api/" + this.settings.apikey + "/sensors/" + this.settings.id)
        if(result.status == 200) {
            let resultJSON = await result.json()
            if (Array.isArray(resultJSON)) {
                let item = resultJSON.length == 0 ? "" : resultJSON[0].error
                this.logger.warning(this.key, "/checkPresence - error code " + item.type + " return")
                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid request " + JSON.stringify(item)
                }
            } else {
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: resultJSON
                }
            }
        } else {
            return {
                error: true,
                package: Package.name,
                message: "Invalid status " + result.status
            }
        }
        
        
    }

}

export default HueSensor