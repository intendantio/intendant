import SmartObject from '@intendant/smartobject'
import fetch from 'node-fetch'
import Package from './package.json'
import Https from 'https'

const httpsAgent = new Https.Agent({
    rejectUnauthorized: false,
})

class Hub extends SmartObject {

    constructor(settings, logger, core) {
        super(settings, logger, core, Package)
        this.updateState()
        this.listener = {}
    }

    async updateState() {
        try {
            this.core.logger.verbose(Package.name, "Long polling")
            let result = await fetch("https://" + this.settings.path + "/eventstream/clip/v2", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'hue-application-key': this.settings.apikey
                },
                agent: httpsAgent
            })
            if (result.status == 200) {
                let resultJSON = await result.json()
                let data = resultJSON[0]
                data.data.forEach(pData => {
                    if(typeof this.listener[pData.id] == 'function') {
                        pData.creationtime = data.creationtime
                        this.listener[pData.id](pData)
                    }
                })
            }
            setTimeout(() => {
                this.updateState()
            },500)
        } catch (error) {
            setTimeout(() => {
                this.updateState()
            },(1000 * 1200))
        }
        
    }

}

export default Hub