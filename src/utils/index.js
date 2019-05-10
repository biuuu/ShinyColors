import isString from 'lodash/isString'

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

const trimWrap = (str) => {
  return trim(str).replace(/\\r/g, '\r').replace(/\\n/g, '\n')
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

const replaceWords = (str, map, lang = 'ja') => {
  if (!str) return str
  let _str = str
  for (let [key, val] of map) {
    if (!key || key.length < 2) continue
    const expr = key.replace(/\?/g, '\\?').replace(/\./g, '\\.').replace(/\*/g, '\\*').replace(/\+/g, '\\+')
    const reStr = lang === 'en' ? `\\b${expr}\\b` : `${expr}`
    if (typeof val === 'string') {
      _str = _str.replace(new RegExp(reStr, 'g'), val)
    } else if (val && val.trans && !val.noun) {
      if (val.ignoreCase) {
        _str = _str.replace(new RegExp(reStr, 'gi'), val.trans)
      } else {
        _str = _str.replace(new RegExp(reStr, 'g'), val.trans)
      }
    }
  }
  return _str
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
  replaceWords
}
