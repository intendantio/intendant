const fsextra = require('fs')
let icons = []
fsextra.readdirSync("../admin/public/ressource/icon").forEach(p => {
    icons.push(p.replace(".svg",""))
})
fsextra.writeFileSync('../admin/public/ressource/icon.json',JSON.stringify(icons))