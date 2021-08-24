const DraftLog = require('draftlog')
const chalk = require('chalk')
DraftLog(console)
const moduleconf = require('./module.json')
const fetch = require('node-fetch')
const FormData = require('form-data')
const fsextra = require('fs-extra')
const fs = require('fs')
const zipFolder = require('zip-a-folder')
const { exec } = require('child_process')

console.log()
console.log(chalk.white.bold.bgMagenta(" Intendant - Market Publish  "))
console.log()


let update = console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Publish "))
update(chalk.white.bold.bgYellow(" >> ") + chalk(" git add ./public/* "))
exec("git reset", () => {
    update(chalk.white.bold.bgYellow(" >> ") + chalk(" git add ./public/* "))
    exec("git add ./public/*", () => {
        update(chalk.white.bold.bgYellow(" >> ") + chalk(" git commit -m 'Market - Auto update module & smartobject' ") )
        exec('git commit -m "Market - Auto update module & smartobject"', () => {
            update(chalk.white.bold.bgYellow(" >> ") + chalk(" git push "))
            exec("git push", () => {
                update(chalk.white.bold.bgGreen(" >> ") + chalk(" Module publish ") + chalk.bold.green(" ✔"))
                
            })
        })
    })
})

