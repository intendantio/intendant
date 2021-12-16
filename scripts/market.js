require('draftLog')(console)

const chalk = require('chalk')
const childProcess = require('child_process')
const fsextra = require('fs-extra')
const fetch = require('node-fetch')

console.log()
console.log(chalk.white.bold.bgMagenta(" Intendant - Market "))
console.log()

const modules = fsextra.readJsonSync("./public/module.json")

let markets = new Array()

const main = async () => {
    for (let index = 0; index < modules.length; index++) {
        let result = await fetch(modules[index] + "/raw/main/sources/package.json")
        let resultJSON = await result.json()
        let resultMain = await fetch(modules[index] + "/raw/main/package.json", {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            }
        })
        let resultMainJSON = await resultMain.json()
        let raw = modules[index].replace("https://github.com","https://raw.githubusercontent.com") + "/main/releases/" + resultMainJSON.name + "-" + resultJSON.version + ".tgz"
        console.log(raw + " > " + resultJSON.version)
        markets.push({
            name: resultJSON.name,
            icon: resultJSON.icon,
            version: resultJSON.version,
            manufacturer: resultJSON.manufacturer,
            tags: resultJSON.tags,
            requirements: resultJSON.requirements,
            type: resultJSON.module,
            models: resultJSON.models,
            product: resultJSON.product,
            raw: raw
        })
    }
    fsextra.writeJSONSync("./public/index.json",markets)
}

main()