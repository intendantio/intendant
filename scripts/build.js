require('draftLog')(console)

const chalk = require('chalk')
const childProcess = require('child_process')
const fsextra = require('fs-extra')
const os = require('os').type()

console.log()
console.log(chalk.white.bold.bgMagenta(" Intendant - Build "))
console.log()

const main = async (path) => {
    let update = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(""))
    fsextra.removeSync(path + "/build-error.log")
    fsextra.removeSync(path + "/builds")
    fsextra.copySync(path + "/sources", path + "/builds")
    update(chalk.white.bold.bgYellow(" >> ") + chalk(" Build from " + path))
    
    let command = ".\\node_modules\\.bin\\babel " + path + "/sources --out-dir " + path + "/builds --config-file ./scripts/.babelrc"
    if (os == "Darwin") {
        command = "./node_modules/.bin/babel " + path + "/sources --out-dir " + path + "/builds --config-file ./scripts/.babelrc"
    }
    childProcess.exec(command, async (error) => {
        if (error) {
            fsextra.appendFileSync("./build-error.log", error.stack)
            update(chalk.white.bold.bgRed(" >> ") + chalk(" Error ") + chalk.bold.red(" X"))
        } else {
            if(fsextra.existsSync(path + "/dashboard")) {
                if (process.argv[2] !== "--no-dashboard") {
                    update(chalk.white.bold.bgYellow(" >> ") + chalk(" Build dashboard"))
                    childProcess.exec("cd " + path + "/dashboard && yarn && npm run-script build", () => {
                        update(chalk.white.bold.bgYellow(" >> ") + chalk(" Copy dashboard") + " ")
                        fsextra.mkdirSync(path + "/builds/public")
                        childProcess.exec("cp -r " + path + "/dashboard/build/* " + path + "/builds/public", () => {
                            childProcess.exec("cd " + path + "/releases && npm pack ../builds", () => {
                                update(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
                            })
                        })
                    })
                }
            } else {
                childProcess.exec("cd " + path + "/releases && npm pack ../builds", () => {
                    update(chalk.white.bold.bgGreen(" >> ") + chalk(" Build ") + chalk.bold.green(" ✔"))
                })
            } 
        }
    })
}

const configurations = require('../intendant.module.json')

configurations.forEach(configuration => {
    main(configuration)
})





