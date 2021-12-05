require('draftLog')(console)

const chalk = require('chalk')
const childProcess = require('child_process')
const fsextra = require('fs-extra')

console.log()
console.log(chalk.white.bold.bgMagenta(" Intendant - Development "))
console.log()

const configurations = require('../intendant.module.json')

const main = async () => {
    if(fsextra.existsSync("./development")) {
        fsextra.removeSync("./development")
    }
    fsextra.mkdirSync("./development")
    fsextra.copySync("./template","./development")
    
    let newPackage = fsextra.readJSONSync("./development/package.json")


    for (let indexConfiguration = 0; indexConfiguration < configurations.length; indexConfiguration++) {
        let configuration = configurations[indexConfiguration]
        let pConfiguration = fsextra.readJSONSync(configuration + "/builds/package.json")
        for (let key in pConfiguration.dependencies) {
            newPackage.dependencies[key] = pConfiguration.dependencies[key]
        }
    }

    fsextra.writeJSONSync("./development/package.json",newPackage)

    await childProcess.execSync("cd development && npm install")

    for (let indexConfiguration = 0; indexConfiguration < configurations.length; indexConfiguration++) {
        let configuration = configurations[indexConfiguration]
        let pConfiguration = fsextra.readJSONSync(configuration + "/builds/package.json")
        fsextra.mkdirSync("./development/node_modules/" + pConfiguration.name,{recursive:true})
        fsextra.copySync(configuration + "/builds","./development/node_modules/" + pConfiguration.name)
    }

}

main()

