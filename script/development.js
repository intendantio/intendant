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
fsextra.copySync("./script/.cache", "./.dev")
updateRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Copy ressource") + chalk.green(" ✔"))

updateRemove = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Install") + " /Build")
exec("cd ./.dev && yarn", (err,std,sder) => {
    updateRemove(chalk.white.bold.bgGreen(" >> ") + chalk(" Copy modules") + chalk.green(" ✔"))
    fsextra.copySync("./build/@intendant", ".dev/node_modules/@intendant")
})







