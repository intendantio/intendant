const DraftLog = require('draftlog')
const chalk = require('chalk')
DraftLog(console)
const moduleconf = require('./module.json')
const { exec } = require('child_process')
const fsextra = require('fs-extra')

console.log()
console.log(chalk.white.bold.bgMagenta(" intendant - Development "))
console.log()
let updateRemove = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Delete cache ") + " /Build")
fsextra.removeSync("./.dev")
updateRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Delete cache") + chalk.green(" ✔"))

updateRemove = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Copy ressource ") + " /Build")
fsextra.copySync("./scripts/.cache", "./.dev")
updateRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Copy ressource") + chalk.green(" ✔"))



updateRemove = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Install") + " /Build")
exec("cd ./.dev && yarn", (err,std,sder) => {
    fsextra.copySync("./build/@intendant", ".dev/node_modules/@intendant")
    updateRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Install") + chalk.green(" ✔"))
    moduleconf.filter(r => {
        return r.market
    }).forEach(r => {
        let copyRemove = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Download ") + r.module)
        fsextra.copySync("./build/" + r.module, ".dev/.intendant/" + r.module)
        copyRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Download ") + r.module + " " + chalk.green(" ✔"))
    })

})







