const fse = require('fs-extra')

console.log('clean dist')
fse.emptyDirSync('./dist/')
