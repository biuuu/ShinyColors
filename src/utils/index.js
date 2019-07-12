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

const trim = (str, full = false) => {
  if (!str) return ''
  return full ? str.trim() : str.trimEnd()
}

const trimWrap = (str, full) => {
  return trim(str, full).replace(/\\r/g, '\r').replace(/\\n/g, '\n')
}

const pureRE = str => {
  return str.replace(/\?/g, '\\?')
  .replace(/\./g, '\\.').replace(/\*/g, '\\*')
  .replace(/\+/g, '\\+').replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)')
}

let _console
if (ENVIRONMENT === 'development') {
  _console = restoreConsole()
}
const log = (...args) => {
  if (ENVIRONMENT === 'development') {
    _console.log(...args)
  }
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
    return text.replace(/\r?\n|\r/g, '\\n')
  }
  return text
}

const removeWrap = (text) => {
  if (isString(text)) {
    return text.replace(/\r?\n|\r/g, '')
  }
  return text
}

const replaceWords = (str, map) => {
  if (!str) return str
  let _str = str
  for (let [key, val] of map) {
    if (!key || key.length < 2) continue
    const expr = key.replace(/\?/g, '\\?').replace(/\./g, '\\.').replace(/\*/g, '\\*').replace(/\+/g, '\\+')
    _str = _str.replace(new RegExp(expr, 'g'), val)
  }
  return _str
}

const replaceQuote = (str) => {
  return str
    .replace(/"([^"]*)"/g, '“$1”')
    .replace(/'([^']*)'/g, '“$1”')

}

const speakerList = ['プロデューサー', '審査員']
const transSpeaker = (item, nameMap) => {
  if (item.speaker) {
    const speaker = trim(item.speaker, true)
    if (speakerList.includes(speaker) && nameMap.has(speaker)) {
      item.speaker = tagText(nameMap.get(speaker))
    }
  }
}

export {
  trim,
  trimWrap,
  restoreConsole,
  isDomain,
  log,
  tryDownload,
  replaceWrap,
  removeWrap,
  replaceWords,
  replaceQuote,
  pureRE,
  transSpeaker
}
