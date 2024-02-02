import isString from 'lodash/isString'
import isBoolean from 'lodash/isBoolean'
import isPlainObject from 'lodash/isPlainObject'
import { version } from '../package.json'
import autoResize from './utils/autoResize'

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
  bgm: 'off',
  dev: false
}

const defaultConfig = Object.assign({}, config)

const _keys = ['origin', 'font1', 'font2', 'timeout', 'story', 'auto', 'bgm', 'dev']
const keys = DEV ? _keys.slice(1, _keys.length) : _keys

const getLocalConfig = () => {
  const str = localStorage.getItem('sczh:setting')
  let setting = JSON.parse(str)
  if (!isPlainObject(setting)) setting = {}
  const { origin } = setting
  if (/^https?:\/\//.test(origin)) {
    config.origin = origin.trim()
  }
  keys.forEach(key => {
    let value = setting[key]
    if (isString(value)) value = value.trim()
    if (isBoolean(value) || value) {
      config[key] = value
    }
  })

  if (DEV & ENVIRONMENT === 'development') {
    config.origin = 'http://localhost:15944'
  }
  if (DEV) {
    config.dev = true
  }
}

const saveConfig = () => {
  const data = {}
  keys.forEach(key => {
    if (config[key] !== defaultConfig[key]) {
      data[key] = config[key]
    }
  })
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
        config.origin = origin.trim()
      }
    }
  },
  dev: {
    id: 0, titles: ['打开开发模式', '关闭开发模式'],
    callback: () => {
      config.dev = !config.dev
    }
  },
  update: {
    id: 0, title: '检查更新',
    callback: () => {
      window.open(`${config.origin}/ShinyColors.user.js`)
    }
  },
  resize: {
    id: 0, title: '调整窗口尺寸',
    callback: () => autoResize(10)
  }
}

const menuCommandCb = (cb) => {
  cb()
  saveConfig()
  setAllGMMenuCommand()
}

let win = (window.unsafeWindow || window)

const setGMMenuCommand = (type) => {
  const value = config[type]
  const data = menuCommand[type]
  let text = ''
  if (isBoolean(value)) {
    let index = value ? 1 : 0
    text = data.titles[index]
  } else {
    text = data.title || data[value]
  }
  const id = data.id
  if (id) {
    win.GM_unregisterMenuCommand(id)
  }
  data.id = win.GM_registerMenuCommand(text, () => {
    menuCommandCb(data.callback)
  })
}

const setAllGMMenuCommand = () => {
  if (!win.GM_registerMenuCommand || !win.GM_unregisterMenuCommand) return
  const menuCommandList = ['update', 'bgm', 'story', 'origin', 'auto', 'dev', 'resize']
  menuCommandList.forEach(type => {
    setGMMenuCommand(type)
  })
}

getLocalConfig()
getConfigFromHash()
setAllGMMenuCommand()

win.addEventListener('hashchange', getConfigFromHash)

export { PREVIEW_COUNT, saveConfig }
export default config
