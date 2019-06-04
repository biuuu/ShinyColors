const ghpages = require('gh-pages')
const fse = require('fs-extra')
const md5Dir = require('md5-dir/promise')
const { version } = require('../package.json')
const glob = require('glob')
const CSV = require('papaparse')
const moduleId = require('./gameModule.json')

const Glob = glob.Glob
glob.promise = function (pattern, options) {
  return new Promise(function (resolve, reject) {
    var g = new Glob(pattern, options)
    g.once('end', resolve)
    g.once('error', reject)
  })
}

const readCsv = async (csvPath, silence) => {
  try {
    const data = await new Promise((rev, rej) => {
      fse.readFile(csvPath, 'utf-8', (err, data) => {
        if (err) rej(err)
        rev(data)
      })
    })
    return CSV.parse(data.replace(/^\ufeff/, ''), { header: true }).data
  } catch (err) {
    if (!silence) {
      console.error(`读取csv失败：${err.message}\n${err.stack}`)
    }
    return []
  }
}

const etcFiles = ['image', 'item', 'mission', 'support-skill', 'mission-re']

const start = async () => {
  await fse.emptyDir('./dist/data/')
  const hash = await md5Dir('./data/')
  console.log(hash)
  await fse.writeJSON('./dist/manifest.json', { hash, version, moduleId })
  console.log('story...')
  const files = await glob.promise('./data/story/**/*.csv')
  const prims = files.map(file => {
    return readCsv(file).then(list => {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].id === 'info') {
          if (list[i].name) {
            const name = list[i].name.trim()
            if (name) {
              return [name, file.replace(/^\./, '')]
            }
          }
        }
      }
    })
  })
  const result = await Promise.all(prims)
  const storyData = result.filter(item => {
    if (item && item[0] && item[1]) {
      return true
    }
    return false
  })
  await fse.writeJSON('./dist/story.json', storyData)
  console.log('move data files...')
  await fse.copy('./data/', './dist/data/')
  console.log('move etc...')
  for (let fileName of etcFiles) {
    await fse.move(`./dist/data/etc/${fileName}.csv`, `./dist/data/${fileName}.csv`, { overwrite: true })
  }
  if (process.env.PUBLISH === 'skip') {
    console.log('data prepared')
    return
  }
  if (process.env.GROUP) {
    await fse.outputFile('./dist/CNAME', 'www.shiny.fun')
  }
  console.log('start publish...')
  ghpages.publish('dist', {
    add: false
  }, function () {
    console.log('finished')
  })
}

start()
