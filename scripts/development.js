const DraftLog = require('draftlog')
const chalk = require('chalk')
DraftLog(console)
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


fsextra.removeSync("./.dev/intendant.db")
fsextra.copyFileSync("./.dev/intendant.db.dev", "./.dev/intendant.db")


updateRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Copy ressource") + chalk.green(" ✔"))

const _ = async function () {
    let result = await fetch("https://market.intendant.io")
    let resultJSON = await result.json()

    if (process.argv[2] == "--download-market") {
        for (let rawIndex = 0; rawIndex < resultJSON.length; rawIndex++) {
            const raw = resultJSON[rawIndex];

            let downloadUpdate = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Download ") + raw.name)
            let resultRaw = await fetch(raw.raw)
            downloadUpdate(chalk.white.bold.bgYellow(" >> ") + chalk(" Extract ") + raw.name)
            let buffer = await resultRaw.buffer();
            fs.mkdirSync("./.dev/node_modules/@intendant/" + raw.name, { recursive: true })
            fs.writeFileSync("./.dev/.tmp-download.zip", buffer)
            await extract("./.dev/.tmp-download.zip", { dir: require('path').resolve('./') + "/.dev/" + raw.name + "/" })
            fs.unlinkSync("./.dev/.tmp-download.zip")
            let tmpPackage = JSON.parse(fs.readFileSync(require('path').resolve('./') + "/.dev/package.json").toString())
            let currentPackage = JSON.parse(fs.readFileSync(require('path').resolve('./') + "/.dev/" + raw.name + "/package.json").toString())
            for (let key in currentPackage.dependencies) {
                let dependencie = currentPackage.dependencies[key]
                let findInCurrent = false
                for (let tmpKey in tmpPackage.dependencies) {
                    let tmpDependencie = tmpPackage.dependencies[tmpKey]
                    if (key == tmpKey) {
                        findInCurrent = tmpDependencie
                    }
                }
                if (findInCurrent) { } else {
                    tmpPackage.dependencies[key] = dependencie
                }
            }
            fs.writeFileSync(require('path').resolve('./') + "/.dev/package.json", JSON.stringify(tmpPackage), null, 4)
            downloadUpdate(chalk.white.bold.bgGreen(" >> ") + chalk(" Download ") + chalk.green(" ✔"))
        }






        let downloadModule = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Install dependencies "))

        exec("cd ./.dev && yarn", (err, std, sder) => {

            exec("cd ./.dev/node_modules && rm -rf @intendant", () => {
                exec("cp -r build/packages/@intendant .dev/node_modules", () => {

                    downloadModule(chalk.white.bold.bgGreen(" >> ") + chalk(" Install dependencies ") + chalk.green(" ✔"))

                })
            })

        })

    } else {
        for (let rawIndex = 0; rawIndex < resultJSON.length; rawIndex++) {
            if (fs.existsSync("./build/" + resultJSON[rawIndex].name)) {


                let downloadUpdate = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Copy ") + resultJSON[rawIndex].name)

                let configuration = JSON.parse(fs.readFileSync("./build/" + resultJSON[rawIndex].name + "/package.json"))
                if (configuration.module != "core") {

                fs.mkdirSync("./.dev/.intendant/" + resultJSON[rawIndex].name, { recursive: true })

                
                    fsextra.copySync("./build/" + resultJSON[rawIndex].name, ".dev/.intendant/" + resultJSON[rawIndex].name + "/", { recursive: true })
                    let tmpPackage = JSON.parse(fs.readFileSync(require('path').resolve('./') + "/.dev/package.json").toString())
                    let currentPackage = JSON.parse(fs.readFileSync(require('path').resolve('./') + "/.dev/.intendant/" + resultJSON[rawIndex].name + "/package.json").toString())
                    for (let key in currentPackage.dependencies) {
                        let dependencie = currentPackage.dependencies[key]
                        let findInCurrent = false
                        for (let tmpKey in tmpPackage.dependencies) {
                            let tmpDependencie = tmpPackage.dependencies[tmpKey]
                            if (key == tmpKey) {
                                findInCurrent = tmpDependencie
                            }
                        }
                        if (findInCurrent) { } else {
                            tmpPackage.dependencies[key] = dependencie
                        }
                    }
                    fs.writeFileSync(require('path').resolve('./') + "/.dev/package.json", JSON.stringify(tmpPackage), null, 4)
                    downloadUpdate(chalk.white.bold.bgGreen(" >> ") + chalk(" Copy ") + chalk.green(" ✔"))
                } else {
                    downloadUpdate(chalk.white.bold.bgGreen(" >> ") + chalk(" Copy ") + chalk.green(" ✔"))
                }
            }
        }
        let downloadModule = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Install dependencies "))

        exec("cd ./.dev && yarn", (err, std, sder) => {

            exec("cd ./.dev/node_modules && rm -rf @intendant", () => {
                exec("cp -r build/@intendant .dev/node_modules", () => {

                    downloadModule(chalk.white.bold.bgGreen(" >> ") + chalk(" Install dependencies ") + chalk.green(" ✔"))

                })
            })

        })

    }
}

fs.mkdirSync("./.dev/.intendant/@intendant", { recursive: true })

_()

