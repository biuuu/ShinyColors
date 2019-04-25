const numRE = '(\\d{1,10}\\.?\\d{0,4}?)'
const percentRE = '(\\d{1,10}\\.?\\d{0,4}?[%％])'

const parseRegExp = (str, nounRE) => {
  return str.replace(/\(/g, '\\(')
    .replace(/\$num/g, numRE)
    .replace(/\$percent/g, percentRE)
    .replace(/\$noun/g, nounRE)
}

const autoTransCache = new Map()

const replaceSkill = (text, { skillMap, nounMap, nounRE }) => {
  if (autoTransCache.has(text)) return autoTransCache.get(text)
  let result = text
  for (let [key, trans] of skillMap) {
    const re = new RegExp(parseRegExp(key, nounRE), 'gi')
    result = result.replace(re, (...arr) => {
      let _trans = trans
      for (let i = 1; i < arr.length - 2; i++) {
        let eleKey = arr[i].toLowerCase()
        if (nounMap.has(eleKey)) {
          _trans = _trans.replace(`$${i}`, nounMap.get(eleKey))
        } else {
          _trans = _trans.replace(`$${i}`, arr[i])
        }
      }
      return _trans
    })
  }
  autoTransCache.set(text, result)
  return result
}

export default replaceSkill
