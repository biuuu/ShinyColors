import { isDomain, trim } from './utils/index'
import isString from 'lodash/isString'
import isBoolean from 'lodash/isBoolean'
import isPlainObject from 'lodash/isPlainObject'
import { version } from '../package.json'

const PREVIEW_COUNT = 5

const config = {
  origin: 'https://www.shiny.fun',
  hash: '',
  localHash: '',
  version: version,
  story: 'normal',
  timeout: 30,
  font1: 'yuanti',
  font2: 'heiti',
  auto: 'off',
  bgm: 'off'
}

const defaultConfig = Object.assign({}, config)

const fontList = ['yuanti', 'heiti', 'yuanti2']

const FONT = {
  HEITI_JA: 'UDKakugo_SmallPr6-B',
  HEITI_TRANS: `sczh-heiti,UDKakugo_SmallPr6-B`,
  YUAN_JA: 'HummingStd-E',
  YUAN_TRANS: `sczh-yuanti,HummingStd-E`
}

const _keys = ['origin', 'font1', 'font2', 'timeout', 'story', 'auto', 'bgm']
const keys = DEV ? _keys.slice(1, _keys.length) : _keys

const setFont = () => {
  FONT.HEITI_TRANS = `${fontList.includes(config.font2) ? 'sczh-' : ''}${config.font2},${FONT.HEITI_JA}`
  FONT.YUAN_TRANS = `${fontList.includes(config.font1) ? 'sczh-' : ''}${config.font1},${FONT.YUAN_JA}`
}

const fixDefault = (data) => {
  if (data.origin === 'https://biuuu.github.io/ShinyColors') {
    data.origin = defaultConfig.origin
  }
}

const getLocalConfig = () => {
  const str = localStorage.getItem('sczh:setting')
  let setting = JSON.parse(str)
  if (!isPlainObject(setting)) setting = {}
  fixDefault(setting)
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
  if (DEV & ENVIRONMENT === 'development') {
    config.origin = 'http://localhost:15944'
  }
}

const saveConfig = () => {
  const data = {}
  keys.forEach(key => {
    if (config[key] !== defaultConfig[key]) {
      data[key] = config[key]
    }
  })
  setFont()
  localStorage.setItem('sczh:setting', JSON.stringify(data))
}

const getConfigFromHash = () => {
  let str = location.hash
  str = str.slice(1).replace(/\?tdsourcetag=s_pc(tim|qq)_aiomsg/, '')
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

const menuCommand = {
  auto: {
    on: '关闭机翻', off: '开启机翻', id: 0, 
    callback: () => {
      config.auto = config.auto !== 'off' ? 'off' : 'on'
    }
  },
  story: {
    normal: '开启剧情提取', edit: '关闭剧情提取', id: 0,
    callback: () => {
      if (config.story === 'normal') {
        config.story = 'edit'
      } else {
        const btnClose = document.getElementById('btn-close-sczh')
        if (btnClose) {
          btnClose.click()
        } else {
          config.story = 'normal'
        }
      }
    }
  },
  bgm: {
    on: '关闭BGM后台播放', off: '开启BGM后台播放', id: 0, 
    callback: () => {
      config.bgm = config.bgm !== 'off' ? 'off' : 'on'
    }
  },
  origin: {
    id: 0, title: '修改数据源',
    callback: () => {
      const origin = prompt('请输入数据源URL，清空则使用默认数据源', config.origin)
      if (origin !== null) {
        config.origin = trim(origin)
      }
    }
  }
}

const menuCommandCb = (cb) => {
  cb()
  saveConfig()
  setAllGMMenuCommand()
}

const setGMMenuCommand = (type) => {
  const value = config[type]
  const data = menuCommand[type]
  const text = data.title || data[value]
  const id = data.id
  if (id) {
    GM_unregisterMenuCommand(id)
  }
  data.id = GM_registerMenuCommand(text, () => {
    menuCommandCb(data.callback)
  })
}

const setAllGMMenuCommand = () => {
  if (!GM_registerMenuCommand || !GM_unregisterMenuCommand) return
  const menuCommandList = ['bgm', 'story', 'origin', 'auto']
  menuCommandList.forEach(type => {
    setGMMenuCommand(type)
  })
}

getLocalConfig()
getLocalHash()
getConfigFromHash()
setAllGMMenuCommand()

window.addEventListener('hashchange', getConfigFromHash)

export { FONT, PREVIEW_COUNT, saveConfig }
export default config
