import isString from 'lodash/isString'
import config from '../config'
import { restoreText } from './tagText'

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

const restoreSpace = (str) => {
  return str.replace(/\u200b/g, ' ')
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

const log = (...args) => {
  if (config.dev) {
    console.info(...args)
  }
}

const log2 = (...args) => {
  console.info(...args)
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

const storyTextLogStyle = (list) => {
  // let count = 0
  let text = list.map(item => {
    if (item[1]) {
      // count++
      item[1] = restoreText(item[1])
      return item.join('\n') + '\n'
    }
    return item[0]
  }).join('\n')
  // count += list.length
  // text = `%c${text}%c`
  // const styleList = []
  // for (let i = 0; i < count; i++) {
  //   if (i % 2 === 0) {
  //     styleList.push(`background-color:#ead2de;padding:0 4px`)
  //   } else {
  //     styleList.push(`background-color:#c7d9bd;padding:0 4px`)
  //   }
  // }
  // styleList.push('')
  return text
}

const isNewVersion = (newVer = '0.0.0', oldVer = '0.0.0') => {
  let isNew = false
  const arr1 = newVer.split('.').map(str => parseInt(str, 10))
  const arr2 = oldVer.split('.').map(str => parseInt(str, 10))
  for (let i = 0; i < arr1.length; i++) {
    let newNum = arr1[i] || 0
    let oldNum = arr2[i] || 0
    if (newNum > oldNum) isNew = true
  }
  return isNew
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

const tagStoryText = (data) => {
  data.forEach(item => {
    if (item.text && !item.text.startsWith('\u200b')) {
      item.text = '\u200c' + item.text
    }
  })
}

const uniqueStoryId = () => {
  const idMap = new Map()
  return (id) => {
    if (id && !/^0+$/.test(id) && id !== 'select') {
      if (idMap.has(id)) {
        const count = idMap.get(id)
        idMap.set(id, count + 1)
        return `${id}-${count}`
      } else {
        idMap.set(id, 0)
      }
    }
    return id
  }
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

const makePromise = (callback, ...args) => {
  let result = null
  let promiseObj = null
  return async () => {
    if (!promiseObj) {
      promiseObj = callback(...args)
    }
    if (!result) {
      result = await promiseObj
    }
    return result
  }
}

export {
  trim, trimWrap, restoreSpace, fixWrap, isDomain, log, log2, makePromise,
  tryDownload, replaceWrap, removeWrap, replaceWords, replaceQuote, pureRE,
  sleep, tagStoryText, sess, uniqueStoryId, isNewVersion, storyTextLogStyle
}
