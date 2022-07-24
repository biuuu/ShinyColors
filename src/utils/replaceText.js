import { fixWrap } from './index'
import isString from 'lodash/isString'

const autoTransCache = new Map()

const replaceText = (text, expMap, wordMaps = []) => {
  if (autoTransCache.has(text)) return autoTransCache.get(text)
  let result = text
  for (let [re, trans] of expMap) {
    result = result.replace(re, (...arr) => {
      let _trans = trans
      for (let i = 1; i < arr.length - 2; i++) {
        let eleKey = arr[i]
        let replaced = false
        wordMaps.forEach(map => {
          if (map.has(eleKey)) {
            _trans = _trans.replace(`$${i}`, map.get(eleKey))
            replaced = true
          }
        })
        if (!replaced) {
          if (/億$/.test(arr[i])) {
            arr[i] = arr[i].replace(/億$/, '亿')
          }
          _trans = _trans.replace(`$${i}`, arr[i])
        }
      }
      return _trans
    })
    re.lastIndex = 0
  }
  if (text !== result) {
    autoTransCache.set(text, result)
  }
  return result
}

const replaceItem = (item, key, data) => {
  if (!item || !isString(item[key])) return
  const { expMap, wordMaps, textMap } = data
  const text = fixWrap(item[key])
  let _text = text
  if (!text) return
  if (textMap?.has(text)) {
    item[key] = textMap.get(text)
  } else {
    _text = replaceText(text, expMap, wordMaps)
    if (text !== _text) {
      item[key] = _text
    }
  }
}

export { replaceItem }
export default replaceText
