const DraftLog = require('draftlog')
const chalk = require('chalk')
DraftLog(console)
const pModule = require('./module.json')
const fetch = require('node-fetch')
const FormData = require('form-data')
const fsextra = require('fs-extra')
const fs = require('fs')
const zipFolder = require('zip-a-folder')
const { exec } = require('child_process')

if(process.argv[2] == undefined) {
    console.log(chalk.white.bold.white("yarn npm-publish {version}"))
    return
} 

console.log()
console.log(chalk.white.bold.bgMagenta(" Intendant - Npm Publish  "))

console.log()



pModule.forEach((modulec, index) => {
    if(modulec["publish-npm"]) {
        let update = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Npm publish " + modulec.module ))
        exec("cd ./build/packages/" + modulec.module + " &&  yarn publish --new-version " + process.argv[2], (error,stdout,stder) => {
            update(chalk.white.bold.bgGreen(" >> ") + chalk(" Npm publish " + modulec.module) + chalk.bold.green(" ✔"))
        })
    }
})


