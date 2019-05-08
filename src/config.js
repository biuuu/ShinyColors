import { isDomain } from './utils/index'
import isString from 'lodash/isString'
import isBoolean from 'lodash/isBoolean'
import isPlainObject from 'lodash/isPlainObject'
import { version } from '../package.json'

const MODULE_ID = {
  REQUEST: 2,
  PHRASE: 4
}

const config = {
  origin: 'https://biuuu.github.io/ShinyColors',
  hash: '',
  localHash: '',
  version: version,
  timeout: 30,
  font1: 'yuanti',
  font2: 'heiti'
}

const defaultConfig = Object.assign({}, config)

const fontList = ['yuanti', 'heiti', 'yuanti2']

const FONT = {
  HEITI_JA: 'UDKakugo_SmallPr6-B',
  HEITI_TRANS: `sczh-heiti,UDKakugo_SmallPr6-B`,
  YUAN_JA: 'HummingStd-E',
  YUAN_TRANS: `sczh-yuanti,HummingStd-E`
}

const keys = DEV ? ['font1', 'font2', 'timeout'] : ['origin', 'font1', 'font2', 'timeout']

const setFont = () => {
  FONT.HEITI_TRANS = `${fontList.includes(config.font2) ? 'sczh-' : ''}${config.font2},${FONT.HEITI_JA}`
  FONT.YUAN_TRANS = `${fontList.includes(config.font1) ? 'sczh-' : ''}${config.font1},${FONT.YUAN_JA}`
}

const getLocalConfig = () => {
  const str = localStorage.getItem('sczh:setting')
  let setting = JSON.parse(str)
  if (!isPlainObject(setting)) setting = {}
  const { origin } = setting
  if (isDomain(origin)) {
    config.origin = origin.trim()
  }
  keys.forEach(key => {
    let value = setting[key]
    if (isString(value)) value = value.trim()
    if (isBoolean(value) || value) {
      config[key] = value
    }
  })
  setFont()
  if (DEV) {
    config.origin = 'http://localhost:15944'
  }
}

const saveConfig = () => {
  const data = {}
  keys.forEach(key => {
    data[key] = config[key]
  })
  setFont()
  localStorage.setItem('sczh:setting', JSON.stringify(data))
}

const getConfigFromHash = () => {
  let str = location.hash
  str = str.slice(1)
  let arr = str.split(';')
  arr.forEach(_str => {
    let _arr = _str.split('=')
    let k = decodeURIComponent(_arr[0].trim())
    let v = _arr[1] ? decodeURIComponent(_arr[1].trim()) : ''
    if (k && keys.includes(k)) {
      if (v) {
        config[k] = v
      } else {
        config[k] = defaultConfig[k]
      }
      saveConfig()
    }
  })
}

const getLocalHash = () => {
  try {
    const str = sessionStorage.getItem('sczh:data')
    const data = JSON.parse(str)
    config.localHash = data.hash
  } catch (err) {
    // ignore
  }
}

getLocalConfig()
getLocalHash()
getConfigFromHash()

window.addEventListener('hashchange', getConfigFromHash)

export { MODULE_ID, FONT }
export default config
