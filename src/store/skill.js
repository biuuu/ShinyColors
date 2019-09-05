import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trim, pureRE, trimWrap } from '../utils/index'
import sortWords from '../utils/sortWords'
import parseRegExp from '../utils/parseRegExp'

const expMap = new Map()
const nounMap = new Map()
const nounArr = []
let loaded = false

const getSupportSkill = async () => {
  if (!loaded) {
    let csv = await getLocalData('support-skill')
    if (!csv) {
      csv = await fetchData('/data/support-skill.csv')
      setLocalData('support-skill', csv)
    }
    const list = parseCsv(csv)
    const reMap = new Map()
    sortWords(list, 'text').forEach(item => {
      if (item && item.text) {
        const text = trimWrap(item.text)
        const trans = trimWrap(item.trans)
        const type = trim(item.type)
        if (text && trans) {
          if (type === 'noun') {
            nounArr.push(pureRE(text))
            nounMap.set(text, trans)
          } else {
            reMap.set(text, trans)
          }
        }
      }
    })
    const expList = [
      { re: /\$noun/g, exp: `(${nounArr.join('|')})` }
    ]
    for (let [key, value] of reMap) {
      const re = parseRegExp(key, expList)
      expMap.set(re, value)
    }
    loaded = true
  }

  return { expMap, wordMaps: [nounMap] }
}

export { getSupportSkill }
