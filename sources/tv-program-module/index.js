import Package from './package.json'
import fetch from 'node-fetch'
import xml2json from 'xml2js'

class ExternalRecipe {

    constructor(core) {
        this.core = core
        this.configuration = "https://xmltv.ch/xmltv/xmltv-tnt.xml"
    }

    /*
        Action
    */
    async __getProgram(settings = {}) {
        try {
            let data = ""
            if (settings.program) {
                let resultCache = await this.core.controller.cache.get({
                    reference: Package.name
                })
                if (resultCache.error) {
                    return resultCache
                }
                if (resultCache.cache) {
                    this.core.logger.verbose(Package.name, "Use cache")
                    data = resultCache.data
                } else {
                    let result = await fetch(this.configuration)
                    let resultText = await result.text()
                    data = resultText
                    await this.core.controller.cache.insert({
                        reference: Package.name,
                        data: resultText,
                        interval: 2592000
                    })
                }
                let dataObject = await xml2json.parseStringPromise(data)
                let find = false
                let item = {}
                dataObject.tv.channel.forEach(channel => {
                    if (channel['display-name'][0].toLowerCase() == settings.program.toLowerCase()) {
                        find = true
                        item = channel
                    }
                })
                if (find == false) {
                    this.core.logger.warning(Package.name, "Program is missing")
                    return {
                        error: true,
                        package: Package.name,
                        message: "Program is missing"
                    }
                } else {
                    let id = item["$"].id
                    let date = new Date()
                    let day = date.getDate()
                    let allProgram = dataObject.tv.programme.filter(program => {
                        return (program["$"].channel).toLowerCase() == id.toLowerCase()
                    })
                    allProgram = allProgram.filter(program => {
                        return program["$"].start.slice(6, 8) == day && parseInt(program["$"].start.slice(8, 10)) == settings.hour && parseInt(program["$"].start.slice(10, 12)) == settings.minute
                    })
                    if (allProgram.length == 0) {
                        return {
                            error: true,
                            package: Package.name,
                            message: "Program is missing"
                        }
                    } else {
                        let program = allProgram[0]
                        return {
                            error: false,
                            package: Package.name,
                            data: {
                                title: program.title[0]
                            },
                            message: "",
                        }
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "Program is missing")
                return {
                    error: true,
                    package: Package.name,
                    message: "Program is missing"
                }
            }
        } catch (error) {
            this.core.logger.warning(Package.name, "Throw exception")
            return {
                error: true,
                package: Package.name,
                message: "Throw exception"
            }
        }
    }

    async __getAllProgram(settings = {}) {
        try {
            let data = ""
            let resultCache = await this.core.controller.cache.get({
                reference: Package.name
            })
            if (resultCache.error) {
                return resultCache
            }
            if (resultCache.cache) {
                this.core.logger.verbose(Package.name, "Use cache")
                data = resultCache.data
            } else {
                let result = await fetch(this.configuration)
                let resultText = await result.text()
                data = resultText
                await this.core.controller.cache.insert({
                    reference: Package.name,
                    data: resultText,
                    interval: 2592000
                })
            }
            let dataObject = await xml2json.parseStringPromise(data)
            let channels = dataObject.tv.channel.map(channel => {
                return channel['display-name'][0].toLowerCase()
            })
            return {
                error: false,
                package: Package.name,
                data: channels,
                message: "",
            }
        } catch (error) {
            this.core.logger.warning(Package.name, "Throw exception")
            return {
                error: true,
                package: Package.name,
                message: "Throw exception"
            }
        }
    }

}

export default ExternalRecipe