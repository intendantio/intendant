import Controller from "./Controller"
import fetch from 'node-fetch'
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import Result from '../utils/Result'
import StackTrace from "../utils/StackTrace"

class Notification extends Controller {

    async notify(title, message, tokens) {
        try {
            let tmpBody = []
            Tracing.verbose(Package.name,"Send notification " + title + " " + message + " at " + tokens.length + " token(s)")
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
            return new Result(Package.name,true,"")
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when user notify")
            return new Result(Package.name, true, "Error occurred when user notify")
        }
        
    }

}

export default Notification