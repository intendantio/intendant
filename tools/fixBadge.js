const fs = require('fs')

let clover = fs.readFileSync('./coverage/clover.xml').toString()
console.log(clover)