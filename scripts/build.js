const DraftLog = require('draftlog')
const chalk = require('chalk')
DraftLog(console)
const pModule = require('./module.json')



const { exec } = require('child_process')
const fsextra = require('fs-extra')
const fs = require('fs')
const zipFolder = require('zip-a-folder')
console.log()
console.log(chalk.white.bold.bgMagenta(" Intendant - Build "))
console.log()
let updateRemove = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Delete cache ") + " /Build")
fsextra.removeSync("./build")
fsextra.removeSync("./public")
fsextra.removeSync("./build-error.log")
updateRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Delete cache") + chalk.green(" ✔"))

fsextra.mkdirSync("./build/markets",{recursive: true})
fsextra.mkdirSync("./build/packages",{recursive: true})
fsextra.mkdirSync("./build/tools",{recursive: true})
fsextra.mkdirSync("./public")

let marketStack = []

exec("git describe --tags --abbrev=0", (err,stdout,stderr) => {
    let currentTag = stdout
    
pModule.forEach((modulec, index) => {
    let update = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Copy source ") + modulec.module)
    let folder = modulec['publish-market'] ? "markets" : modulec['publish-npm'] ? "packages" : "tools"
    fsextra.copySync("./sources" + modulec.path, "./build/" + folder +  "/" + modulec.module)
    if(modulec['publish-market'] ) {
        let configuration = JSON.parse(fs.readFileSync("./sources" + modulec.path + "/configuration.json").toString())
        marketStack.push({
            version: currentTag.replace("\n",""),
            package:modulec.module,
            name:configuration.name,
            type: configuration.type,
            raw: "https://raw.githubusercontent.com/intendantio/intendant/main/public/" + modulec.module.replace("/","-") + ".zip"
        })
    }
    update(chalk.white.bold.bgYellow(" >> ") + chalk(" Build ") + modulec.module)
    exec("cd scripts && ../node_modules/.bin/babel ../sources" + modulec.path + " --out-dir ../build/" + folder +  "/" + modulec.module + " --config-file ./.babelrc",async  (error) => {
        if (error) {
            fsextra.appendFileSync("./build-error.log", "Build " + modulec.module + " : " + error.signal)
            fsextra.appendFileSync("./build-error.log", error.stack)
            update(chalk.white.bold.bgRed(" >> ") + chalk(" Error " + modulec.module) + chalk.bold.red(" X"))
        } else {
            if(modulec['publish-market']) {
                await zipFolder.zip("./build/markets/" + modulec.module, "./public/" + modulec.module.replace("/","-") + ".zip")
            }
            update(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
        }
    })
})

fs.writeFileSync("./public/index.json", JSON.stringify(marketStack))

if (process.argv[2] !== "--no-dashboard") {
    let updateBuildDashboard = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Build @intendant/dashboard") + " ")
    exec("cd dashboard && yarn && npm run-script build", () => {
        updateBuildDashboard(chalk.white.bold.bgYellow(" >> ") + chalk(" Copy @intendant/dashboard") + " ")
        fsextra.mkdirSync("./build/packages/@intendant/core/public")
        exec("cp -r ./dashboard/build/* ./build/packages/@intendant/core/public", () => {
            updateBuildDashboard(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
        })
    })
}


})
