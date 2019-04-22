const ghpages = require('gh-pages')
const fse = require('fs-extra')

console.log('move data files...')
fse.copySync('./data/', './dist/data/')
console.log('start publish...')
ghpages.publish('dist', {
  add: false
}, function () {
  console.log('finished')
})
