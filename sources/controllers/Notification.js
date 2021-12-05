import Controller from "./Controller"
import fetch from 'node-fetch'
import Package from '../package.json'

class Notification extends Controller {

    async notify(title, message, tokens) {
        let tmpBody = []
        this.core.logger.verbose(Package.name,"Send notification " + title + " " + message + " at " + tokens.length + " token(s)")
        tokens.forEach(client => {
            tmpBody.push({
                "to": client,
                "title": title,
                "body": message
            })
        })
        await fetch("https://exp.host/--/api/v2/push/send", {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(tmpBody)
        })
        return {
            error: false,
            message: "",
            package: Package.name
        }
    }

}

export default Notification