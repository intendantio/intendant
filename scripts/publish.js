const DraftLog = require('draftlog')
const chalk = require('chalk')
DraftLog(console)
const moduleconf = require('./module.json')
const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')

console.log()
console.log(chalk.white.bold.bgMagenta(" Intendant - Market Publish  "))
console.log()

moduleconf.filter(r => {
    return r.market
}).forEach((modulec, index) => {
    let currentPackage = JSON.parse(fs.readFileSync("./packages/" + modulec.module + "/package.json").toString())
    let currentConfiguration = JSON.parse(fs.readFileSync("./packages/" + modulec.module + "/configuration.json").toString())

    let formData = new FormData()
    
    let update =  console.draft(chalk.white.bold.bgYellow(" >> ") + chalk(" Upload ") + modulec.module)

    formData.append("package",modulec.module)
    formData.append("description","")
    formData.append("title",currentConfiguration.name)
    formData.append("type",currentConfiguration.type)
    formData.append("zip",fs.readFileSync("./markets/" + modulec.module + ".zip"), {
        filename: 'zip',
        contentType: 'text/plain'
    })
    update(chalk.white.bold.bgYellow(" >> ") + chalk(" Upload ") + modulec.module)

    fetch("https://market.intendant.io/upload.php",{
        method: 'POST',
        body: formData
    }).then(() => {
        update(chalk.white.bold.bgGreen(" >> ") + chalk(" Upload ") + chalk.bold.green(" ✔"))
    })

})


