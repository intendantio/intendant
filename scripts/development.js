const DraftLog = require('draftlog')
const chalk = require('chalk')
DraftLog(console)
const moduleconf = require('./module.json')
const { exec } = require('child_process')
const fsextra = require('fs-extra')
const fs = require('fs')
const fetch = require('node-fetch')
const extract = require('extract-zip')

console.log()
console.log(chalk.white.bold.bgMagenta(" Intendant - Development "))
console.log()
let updateRemove = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Delete cache ") + " /Build")
fsextra.removeSync("./.dev")

fs.mkdirSync("./.dev/.intendant", { recursive: true })


updateRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Delete cache") + chalk.green(" ✔"))

updateRemove = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Copy ressource ") + " /Build")
fsextra.copySync("./template", "./.dev")
updateRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Copy ressource") + chalk.green(" ✔"))

const _ = async function () {
    let result = await fetch("https://market.intendant.io")
    let resultJSON = await result.json()

    for (let rawIndex = 0; rawIndex < resultJSON.length; rawIndex++) {
        const raw = resultJSON[rawIndex];
        let downloadUpdate = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Download ") + raw.package)
        let resultRaw = await fetch(raw.raw)
        downloadUpdate(chalk.white.bold.bgYellow(" >> ") + chalk(" Extract ") + raw.package)
        let buffer = await resultRaw.buffer();
        fs.mkdirSync("./.dev/.intendant/" + raw.package, { recursive: true })
        fs.writeFileSync("./.dev/.tmp-download.zip", buffer)
        await extract("./.dev/.tmp-download.zip", { dir:  require('path').resolve('./') + "/.dev/.intendant/" + raw.package + "/" })
        fs.unlinkSync("./.dev/.tmp-download.zip")
        downloadUpdate(chalk.white.bold.bgGreen(" >> ") + chalk(" Download ") + chalk.green(" ✔"))
    }
    

}

fs.mkdirSync("./.dev/.intendant/@intendant", { recursive: true })

//_()

let downloadModule = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Install dependencies ") )
    
exec("cd ./.dev && yarn", (err,std,sder) => {

    exec("cd ./.dev/node_modules && rm -rf @intendant", () => {
        exec("cp -r build/packages/@intendant .dev/node_modules", () => {

            downloadModule(chalk.white.bold.bgGreen(" >> ") + chalk(" Install dependencies ") + chalk.green(" ✔"))

        })
    })

})