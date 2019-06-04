const numRE = '(\\d{1,10}\\.?\\d{0,4}?)'
const percentRE = '(\\d{1,10}\\.?\\d{0,4}?[%％])'
const unknownRE = '(.+?)'

const parseRegExp = (str, list) => {
  let result = str.replace(/\$num/g, numRE)
    .replace(/\$percent/g, percentRE)
    .replace(/\$unknown/g, unknownRE)
  list.forEach(item => {
    result = result.replace(item.re, item.exp)
    item.re.lastIndex = 0
  })
  return new RegExp(result, 'gi')
}

export default parseRegExp
