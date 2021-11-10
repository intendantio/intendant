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
fsextra.removeSync("./build")
fsextra.removeSync("./public")
fsextra.removeSync("./build-error.log")
updateRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Delete cache") + chalk.green(" ✔"))

let pModules = fs.readdirSync("./sources")
fsextra.mkdirSync("./public")

let marketStack = []

pModules.forEach((pModule, index) => {
    let update = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Copy source ") + pModule)
    let configuration = JSON.parse(fs.readFileSync("./sources/" + pModule + "/package.json").toString())
    fsextra.copySync("./sources/" + pModule, "./build/" + configuration.name)
    marketStack.push({
        name: configuration.name,
        raw: "https://raw.githubusercontent.com/intendantio/intendant/main/public/intendant-" + configuration.name.split("/")[1] + "-" + configuration.version + ".tgz"
    })
    update(chalk.white.bold.bgYellow(" >> ") + chalk(" Build ") + pModule)
    exec("cd scripts && ..\\node_modules\\.bin\\babel ../sources/" + pModule + " --out-dir ../build/" + configuration.name + " --config-file ./.babelrc", async (error) => {
        if (error) {
            fsextra.appendFileSync("./build-error.log", "Build " + pModule + " : " + error.signal)
            fsextra.appendFileSync("./build-error.log", error.stack)
            update(chalk.white.bold.bgRed(" >> ") + chalk(" Error " + pModule) + chalk.bold.red(" X"))
        } else {
            if( configuration.name == "@intendant/core") {
                fs.writeFileSync("./public/index.json", JSON.stringify(marketStack))
                if (process.argv[2] !== "--no-dashboard") {
                    let updateBuildDashboard = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Build dashboard") + " ")
                    exec("cd dashboard && yarn && npm run-script build", () => {
                        updateBuildDashboard(chalk.white.bold.bgYellow(" >> ") + chalk(" Copy dashboard") + " ")
                        fsextra.mkdirSync("./build/@intendant/core/public")
                        exec("cp -r ./dashboard/build/* ./build/@intendant/core/public", () => {
                            updateBuildDashboard(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
                            exec("cd public && npm pack ../build/" + configuration.name)
                            update(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
                        })
                    })
                }
            } else {
                exec("cd public && npm pack ../build/" + configuration.name)
                update(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
            }
        }
    })
})

