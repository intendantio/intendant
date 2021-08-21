const DraftLog = require('draftlog')
const chalk = require('chalk')
DraftLog(console)
const moduleconf = require('./module.json')
const { exec } = require('child_process')
const fsextra = require('fs-extra')
const fs = require('fs')
const zipFolder = require('zip-a-folder')
console.log()
console.log(chalk.white.bold.bgMagenta(" Intendant - Build "))
console.log()
let updateRemove = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Delete cache ") + " /Build")
fsextra.removeSync("./build")
fsextra.removeSync("./markets")
updateRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Delete cache") + chalk.green(" ✔"))

fsextra.mkdirSync("./build")

fsextra.mkdirSync("./markets")
fsextra.mkdirSync("./markets/@intendant")

moduleconf.forEach((modulec, index) => {
    let update = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Copy source ") + modulec.module)
    fsextra.copySync("./sources" + modulec.path, "./build/" + modulec.module)
    update(chalk.white.bold.bgYellow(" >> ") + chalk(" Build ") + modulec.module)
    exec("cd scripts &&  babel ../sources" + modulec.path + " --out-dir ../build/" + modulec.module + " --config-file ./.babelrc", (error) => {
        if (error) {
            fsextra.appendFileSync("./build-error.log", "Build " + modulec.module + " : " + error.signal)
            fsextra.appendFileSync("./build-error.log", error.stack)
            update(chalk.white.bold.bgRed(" >> ") + chalk(" Error " + modulec.module) + chalk.bold.red(" X"))
        } else {
            update(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
            /*
            zipFolder.zip("./build/" + modulec.module, "./markets/" + modulec.module + ".zip").then(() => {
            })
            */
        }
    })
})

if (process.argv[2] !== "--no-dashboard") {
    let updateBuildDashboard = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Build @intendant/dashboard") + " ")
    exec("cd admin && yarn && npm run-script build", () => {
        updateBuildDashboard(chalk.white.bold.bgYellow(" >> ") + chalk(" Copy @intendant/dashboard") + " ")
        fsextra.mkdirSync("./build/@intendant/core/public")
        exec("cp -r ./admin/build/* ./build/@intendant/core/public", () => {
            updateBuildDashboard(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
        })
    })
}

