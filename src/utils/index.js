import isString from 'lodash/isString'
import tagText from './tagText'

const restoreConsole = () => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  return iframe.contentWindow.console
}

const isDomain = (str) => {
  if (!/^https?:\/\//.test(str)) return false
  if (/\s/.test(str.trim())) return false
  return true
}

const sleep = (time) => {
  return new Promise(rev => {
    setTimeout(rev, time)
  })
}

const trim = (str) => {
  if (!str) return ''
  let _str = str.replace(/[\u0020]+$/g, '')
  return _str.replace(/^[\u0020]+/g, '')
}

const trimWrap = (str, trans = false) => {
  let _str = trim(str).replace(/(\\r)?\\n/g, '\n').replace(/\\r/g, '\n')
  return trans ? _str : _str.replace(/\n{2,}/g, '\n')
}

const fixWrap = (str) => {
  return trim(str).replace(/\r/g, '\n').replace(/\n{2,}/g, '\n')
}

const pureRE = str => {
  return str.replace(/\?/g, '\\?')
  .replace(/\./g, '\\.').replace(/\*/g, '\\*')
  .replace(/\+/g, '\\+').replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)')
}

let _console = restoreConsole()
// if (ENVIRONMENT === 'development') {
//   _console = restoreConsole()
// }
const log = (...args) => {
  if (ENVIRONMENT === 'development') {
    _console.log(...args)
  }
}

const log2 = (...args) => {
  _console.log(...args)
}

const tryDownload = (content, filename) => {
  const eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  const blob = new Blob([content], { type: 'text/csv' })
  eleLink.href = URL.createObjectURL(blob)
  document.body.appendChild(eleLink)
  eleLink.click()
  document.body.removeChild(eleLink)
}

const replaceWrap = (text) => {
  if (isString(text)) {
    return text.replace(/\r?\n/g, '\\n').replace(/\r/g, '\\n')
  }
  return text
}

const removeWrap = (text) => {
  if (isString(text)) {
    return text.replace(/\n|\r/g, '')
  }
  return text
}

const randomSep = (length = 2) => {
  let str = ''
  for (let i = 0; i < length; i++) {
    str += String.fromCharCode(Math.floor(Math.random() * 16 + 65520))
  }
  return str
}

const replaceWords = (str, map) => {
  if (!str || !str.length) return str
  let _str = str
  let needSplit = false
  let sep = randomSep(3)
  if (Array.isArray(str)) {
    _str = str.join(sep)
    needSplit = true
  }
  for (let [key, val] of map) {
    if (!key || key.length < 2) continue
    const expr = key.replace(/\./g, '\\.')
      .replace(/\*/g, '\\*')
    _str = _str.replace(new RegExp(expr, 'g'), val)
  }
  if (needSplit) {
    return _str.split(sep)
  }
  return _str
}

const replaceQuote = (str) => {
  return str
    .replace(/"([^"]*)"/g, '“$1”')
    .replace(/'([^']*)'/g, '“$1”')
    .replace(/‘([^']+)'/g, '“$1”')
}

const speakerList = ['プロデューサー', '審査員']
const transSpeaker = (item, nameMap) => {
  if (item.speaker) {
    const speaker = trim(item.speaker)
    if (speakerList.includes(speaker) && nameMap.has(speaker)) {
      item.speaker = tagText(nameMap.get(speaker))
    }
  }
}

const tagStoryText = (data) => {
  data.forEach(item => {
    if (item.text && !item.text.startsWith('\u200b')) {
      item.text = '\u200c' + item.text
    }
  })
}

const sess = (key, data) => {
  try {
    if (data) {
      sessionStorage.setItem(key, JSON.stringify(data))
      return true
    } else {
      let str = sessionStorage.getItem(key)
      return JSON.parse(str)
    }
  } catch (e) {}
}

export {
  trim, trimWrap, fixWrap, restoreConsole, isDomain, log, log2,
  tryDownload, replaceWrap, removeWrap, replaceWords, replaceQuote, pureRE,
  transSpeaker, sleep, tagStoryText, sess
}
