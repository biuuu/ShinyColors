const ghpages = require('gh-pages')
const fse = require('fs-extra')
const md5Dir = require('md5-dir/promise')

fse.emptyDir('./dist/data/').then(() => {
  return md5Dir('./data/')
}).then((hash) => {
  console.log(hash)
  return fse.writeJSON('./dist/manifest.json', { hash })
}).then(() => {
  console.log('move data files...')
  return fse.copy('./data/', './dist/data/')
}).then(() => {
  console.log('move html files...')
  return fse.copy('./src/proxy.html', './dist/proxy.html')
}).then(() => {
  console.log('start publish...')
  ghpages.publish('dist', {
    add: false
  }, function () {
    console.log('finished')
  })
})
