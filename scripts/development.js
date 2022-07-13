require('draftLog')(console)

const chalk = require('chalk')
const childProcess = require('child_process')
const fsextra = require('fs-extra')

console.log()
console.log(chalk.white.bold.bgMagenta(" Intendant - Development "))
console.log()

const configurations = require('../intendant.module.json')

const main = async () => {

    let update = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(""))

    update(chalk.white.bold.bgYellow(" >> ") + chalk(" Delete cache "))
    if(fsextra.existsSync("./development")) {
        fsextra.removeSync("./development")
    }
    fsextra.mkdirSync("./development")
    fsextra.copySync("./template","./development")
    

    let newPackage = fsextra.readJSONSync("./development/package.json")


    update(chalk.white.bold.bgYellow(" >> ") + chalk(" Insert tmp dependencies "))

        let pConfiguration = fsextra.readJSONSync("./dist/package.json")
        for (let key in pConfiguration.dependencies) {
            newPackage.dependencies[key] = pConfiguration.dependencies[key]
        }

    fsextra.writeJSONSync("./development/package.json",newPackage)

    update(chalk.white.bold.bgYellow(" >> ") + chalk(" Install dependencies "))

    await childProcess.execSync("cd development && npm install")

    update(chalk.white.bold.bgYellow(" >> ") + chalk(" Insert build sources"))
    for (let indexConfiguration = 0; indexConfiguration < configurations.length; indexConfiguration++) {
        let configuration = configurations[indexConfiguration]
        let pConfiguration = fsextra.readJSONSync(configuration + "/dist/package.json")
        fsextra.mkdirSync("./development/node_modules/" + pConfiguration.name,{recursive:true})
        fsextra.copySync(configuration + "/dist","./development/node_modules/" + pConfiguration.name)
    }

    if(fsextra.existsSync("./development/intendant.db.dev")) {
        fsextra.copyFileSync("./development/intendant.db.dev","./development/intendant.db")
    }

    update(chalk.white.bold.bgGreen(" >> ") + chalk("") + chalk.bold.green(" ✔"))
}

main()

