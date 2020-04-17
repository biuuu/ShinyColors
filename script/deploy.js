const ghpages = require('gh-pages')
const fse = require('fs-extra')
const md5Dir = require('md5-dir/promise')
const { version } = require('../package.json')
const glob = require('glob')
const CSV = require('papaparse')
const moduleId = require('./MODULE_ID.json')

const cyweb_token = 't4d0s9zds4fw272poa11'
const trans_api = 'caiyun'  // Optional: google
const language = 'zh-CN'    // Can be changed when using google: en/ko/de/fr/ru etc.

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

const getDate = (offset = 0) => {
  const dt = new Date(Date.now() + (offset * 60 * 60 * 1000))
  const year = dt.getUTCFullYear()
  const month = dt.getUTCMonth() + 1
  const date = dt.getUTCDate()
  const h = dt.getUTCHours()
  const m = dt.getUTCMinutes()
  const sec = dt.getUTCSeconds()
  const msec = dt.getUTCMilliseconds()
  return `${year}/${month}/${date} ${h}:${m}:${sec}.${msec}`
}

const etcFiles = ['image', 'item', 'support-skill', 'mission-re']

const DATA_PATH = process.env.GITHUB_ACTION ? './scdata/data/' : './data/'
const start = async () => {
  await fse.emptyDir('./dist/data/')
  const hash = await md5Dir(DATA_PATH)
  console.log(hash)
  await fse.writeJSON('./dist/manifest.json', { 
    hash, version, moduleId, 
    cyweb_token, trans_api, language,
    date: getDate(8) 
  })
  console.log('story...')
  const files = await glob.promise(`${DATA_PATH}story/**/*.csv`)
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
  await fse.copy(DATA_PATH, './dist/data/')
  console.log('move install.html...')
  await fse.copy('./script/install.html', './dist/install.html')
  console.log('move etc...')
  for (let fileName of etcFiles) {
    await fse.move(`./dist/data/etc/${fileName}.csv`, `./dist/data/${fileName}.csv`, { overwrite: true })
  }
  if (process.env.PUBLISH === 'skip') {
    console.log('data prepared')
    return
  }
  if (process.env.CUSTOM_DOMAIN) {
    await fse.outputFile('./dist/CNAME', 'www.shiny.fun')
  }
  if (process.env.TRAVIS || process.env.GITHUB_ACTION) {
    return
  }
  console.log('start publish...')
  ghpages.publish('dist', {
    add: false
  }, function () {
    console.log('finished')
  })
}

start()
