const numRE = '([+-＋－]?[0-9０-９\u2460-\u2500]{1,10}\\.?[0-9０-９\u2460-\u2500]{0,4}?)'
const percentRE = '([+-＋－]?[0-9０-９]{1,10}\\.?[0-9０-９]{0,4}?[%％])'
const unknownRE = '(.*?)'
const sepRE = '.?'

const parseRegExp = (str, list = []) => {
  let result = str.replace(/\./g, '\\.')
    .replace(/\$num/g, numRE)
    .replace(/\$percent/g, percentRE)
    .replace(/\$unknown/g, unknownRE)
    .replace(/\$uk/g, unknownRE)
    .replace(/\$sep/g, sepRE)
  list.forEach(item => {
    result = result.replace(item.re, item.exp)
    item.re.lastIndex = 0
  })
  return new RegExp(result, 'gi')
}

export default parseRegExp
