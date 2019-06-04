const autoTransCache = new Map()

const replaceText = (text, expMap, wordMaps) => {
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
          _trans = _trans.replace(`$${i}`, arr[i])
        }
      }
      return _trans
    })
    re.lastIndex = 0
  }
  autoTransCache.set(text, result)
  return result
}

export default replaceText
