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
    if(configuration.module == "smartobject") {
        marketStack.push({
            name: configuration.name,
            icon: configuration.icon,
            author: configuration.author,
            version: configuration.version,
            manufacturer: configuration.manufacturer,
            tags: configuration.tags,
            requirements: configuration.requirements,
            type: configuration.module,
            models: configuration.models,
            product: configuration.product,
            state: configuration.state,
            settings: configuration.settings,
            actions: configuration.actions,
            raw: "https://raw.githubusercontent.com/intendantio/intendant/main/public/intendant-" + configuration.name.split("/")[1] + "-" + configuration.version + ".tgz"
        })
    } else {
        marketStack.push({
            name: configuration.name,
            author: configuration.author,
            type: configuration.module,
            version: configuration.version,
            raw: "https://raw.githubusercontent.com/intendantio/intendant/main/public/intendant-" + configuration.name.split("/")[1] + "-" + configuration.version + ".tgz"
        })
    }
    
    
    let os = require('os').type()
    update(chalk.white.bold.bgYellow(" >> ") + chalk(" Build ") + pModule)
    let command = "cd scripts && ..\\node_modules\\.bin\\babel ../sources/" + pModule + " --out-dir ../build/" + configuration.name + " --config-file ./.babelrc"
    if(os == "Darwin") {
        command = "cd scripts && ../node_modules/.bin/babel ../sources/" + pModule + " --out-dir ../build/" + configuration.name + " --config-file ./.babelrc"
    }


    exec(command, async (error) => {
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
                } else {
                    update(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
                }
            } else {
                exec("cd public && npm pack ../build/" + configuration.name)
                update(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
            }
        }
    })
})

