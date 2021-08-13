import Package from './package.json'
import fetch from 'node-fetch'

class ExternalWeather {

    constructor(core) {
        this.core = core
        this.configuration = "https://www.prevision-meteo.ch/services/json/"
    }
    
    async __getWeather(settings = {}) {
        try {
            if (settings.city) {
                let resultCache = await this.core.controller.cache.get({
                    reference: Package.name + "-" + settings.city
                })
                if (resultCache.error) {
                    return resultCache
                }
                if (resultCache.cache) {
                    this.core.logger.verbose(Package.name, "Use cache")
                    return {
                        error: false,
                        code: "ok",
                        message: "",
                        data: resultCache.data,
                        source: "cache://www.prevision-meteo.ch"
                    }
                }
                let result = await fetch(this.configuration + settings.city)
                if (result.status === 200) {
                    let resultJSON = await result.json()
                    if (resultJSON.errors) {
                        return {
                            error: true,
                            code: Package.name + ">invalidResult>code>" + resultJSON.errors[0].code,
                            message: "Invalid result code '" + resultJSON.errors[0].text + "'",
                            data: {}
                        }
                    } else {
                        await this.core.controller.cache.insert({
                            reference: Package.name + "-" + settings.city,
                            data: resultJSON,
                            interval: 600
                        })
                        return {
                            error: false,
                            code: "ok",
                            message: "",
                            data: resultJSON,
                            source: "https://www.prevision-meteo.ch"
                        }
                    }

                } else {
                    this.core.logger.warning(Package.name, "Invalid result status '" + result.status + "'")
                    return {
                        error: true,
                        code: Package.name + ">getWeather>code>invalidStatus>" + result.status,
                        message: "Invalid status " + result.status
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "City is missing")
                return {
                    error: true,
                    code: Package.name + ">getWeather>city>missing",
                    message: "City is missing"
                }
            }
        } catch (error) {
            this.core.logger.warning(Package.name, "Throw exception")
            return {
                error: true,
                code: Package.name + ">getWeather>throwException",
                message: "Throw exception"
            }
        }

    }

}

export default ExternalWeather