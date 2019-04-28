import { isDomain } from './utils/index'
import isString from 'lodash/isString'
import isBoolean from 'lodash/isBoolean'
import isPlainObject from 'lodash/isPlainObject'
import { version } from '../package.json'

const MODULE_ID = {
  REQUEST: 2,
  PHRASE: 4
}

const FONT = {
  HEITI_JA: 'UDKakugo_SmallPr6-B',
  HEITI_TRANS: 'HYQiHei 70S',
  YUAN_JA: 'HummingStd-E',
  YUAN_TRANS: 'Tensentype QinYuanJ W5'
}

const config = {
  origin: 'https://biuuu.github.io/ShinyColors',
  hash: '',
  localHash: '',
  version: version,
  timeout: 20
}

const getLocalConfig = () => {
  const str = localStorage.getItem('sczh:setting')
  let setting = JSON.parse(str)
  if (!isPlainObject(setting)) setting = {}
  const { origin } = setting
  if (isDomain(origin)) {
    config.origin = origin.trim()
  }
  const keys = ['timeout']
  keys.forEach(key => {
    let value = setting[key]
    if (isString(value)) value = value.trim()
    if (isBoolean(value) || value) {
      config[key] = value
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

export { MODULE_ID, FONT }
export default config
