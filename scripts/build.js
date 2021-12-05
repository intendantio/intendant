const DraftLog = require('draftlog')
const chalk = require('chalk')
DraftLog(console)

const { exec } = require('child_process')
const fsextra = require('fs-extra')
const fs = require('fs')
console.log()
console.log(chalk.white.bold.bgMagenta(" Intendant - Build "))
console.log()
let updateRemove = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Delete cache ") + " /Build")
fsextra.removeSync("./build-error.log")
fsextra.removeSync("./builds")
fsextra.removeSync("./public")
fsextra.removeSync("./build-error.log")
updateRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Delete cache") + chalk.green(" ✔"))

fsextra.mkdirSync("./public")

let marketStack = []

let update = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Copy source "))
fsextra.copySync("./sources", "./builds")

let os = require('os').type()
update(chalk.white.bold.bgYellow(" >> ") + chalk(" Build "))
let command = "cd scripts && ..\\node_modules\\.bin\\babel ../sources --out-dir ../builds --config-file ./.babelrc"
if (os == "Darwin") {
    command = "cd scripts && ../node_modules/.bin/babel ../sources --out-dir ../builds --config-file ./.babelrc"
}


exec(command, async (error) => {
    if (error) {
        fsextra.appendFileSync("./build-error.log", error.stack)
        update(chalk.white.bold.bgRed(" >> ") + chalk(" Error ") + chalk.bold.red(" X"))
    } else {
        if(process.argv[2] !== "--no-dashboard") {
            let updateBuildDashboard = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Build dashboard") + " ")
            exec("cd dashboard && yarn && npm run-script build", () => {
                updateBuildDashboard(chalk.white.bold.bgYellow(" >> ") + chalk(" Copy dashboard") + " ")
                fsextra.mkdirSync("./builds/public")
                exec("cp -r ./dashboard/build/* ./builds/public", () => {
                    updateBuildDashboard(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
                    exec("cd releases && npm pack ../builds")
                    update(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
                })
            })
        } else {
            update(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
        }
        
    }
})

