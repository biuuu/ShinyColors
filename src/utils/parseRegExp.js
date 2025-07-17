const numRE = '([+-＋－]?[0-9０-９]{1,10}\\.?[0-9０-９]{0,4}[万億]?)'
const percentRE = '([+-＋－]?[0-9０-９]{1,10}\\.?[0-9０-９]{0,4}?[%％])'
const unknownRE = '([\\s\\S]+)'
const sepRE = '[\\s\\S]?'

const parseRegExp = (str, list = []) => {
  let result = str.replace(/\\/g, '\\\\') // 백슬래시 이스케이프 추가
    .replace(/\./g, '\\.')
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
