import Controller from "./Controller"
import Package from '../package.json'
import Tracing from "../utils/Tracing"
import StackTrace from '../utils/StackTrace'
import Result from '../utils/Result'
import { exec } from 'child_process'
import fetch from 'node-fetch'

class System extends Controller {

    async upgrade() {
        try {
            let result = await fetch("https://raw.githubusercontent.com/intendantio/intendant/main/template/package.json")
            let resultJSON = await result.json()
            let raw = resultJSON.dependencies["@intendant/core"]
            Tracing.verbose(Package.name, "Upgrade " + raw)
            await new Promise((resolve, reject) => {
                exec("npm install " + raw + " -s --silent 2>&1", (e, std, ster) => {
                    resolve()
                })
            })
            process.exit()
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when upgrade")
            return new Result(Package.name, true, "Error occurred when upgrade")
        }
    }

    async checkUpgrade() {
        try {
            let result = await fetch("https://raw.githubusercontent.com/intendantio/intendant/main/sources/package.json")
            let resultJSON = await result.json()
            let version = resultJSON.version
            let currentVersion = Package.version
            return new Result(Package.name, false, "", {
                upgrade: currentVersion != version,
                version: version
            })
        } catch (error) {
            StackTrace.save(error)
            Tracing.error(Package.name, "Error occurred when check upgrade")
            return new Result(Package.name, true, "Error occurred when check upgrade")
        }
    }
}

export default System