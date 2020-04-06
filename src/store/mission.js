import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import parseRegExp from '../utils/parseRegExp'
import { getLocalData, setLocalData } from './index'
import { trim, trimWrap, pureRE } from '../utils/index'
import sortWords from '../utils/sortWords'
import getItem from './item'

let textMap = new Map()
let expMap = new Map()
let nounMap = new Map()
let nameMap = new Map()
let noteMap = new Map()
let loaded = false

const getMission = async (full = false) => {
  if (!loaded) {
    let csv = await getLocalData('mission')
    if (!csv) {
      csv = await fetchData('/data/mission-re.csv')
      setLocalData('mission', csv)
    }
    const list = parseCsv(csv)
    const nounArr = []
    const nameArr = []
    const noteArr = []
    const reMap = new Map()
    sortWords(list, 'text').forEach(item => {
      if (item && item.text) {
        const text = trimWrap(item.text)
        const trans = trimWrap(item.trans, true)
        const type = trim(item.type)
        if (text && trans) {
          if (type === 'noun') {
            nounArr.push(pureRE(text))
            nounMap.set(text, trans)
          } else if (type === 'note') {
            noteArr.push(pureRE(text))
            noteMap.set(text, trans)
            reMap.set(`【${text}】`, `【${trans}】`)
          } else if (type === 'name') {
            nameArr.push(pureRE(text))
            nameMap.set(text, trans)
          } else if (type === 'text') {
            textMap.set(text, trans)
          } else {
            reMap.set(text, trans)
          }
        }
      }
    })
    const expList = [
      { re: /\$name/g, exp: `(${nameArr.join('|')})` },
      { re: /\$noun/g, exp: `(${nounArr.join('|')})` },
      { re: /\$note/g, exp: `(${noteArr.join('|')})` }
    ]
    for (let [key, value] of reMap) {
      const re = parseRegExp(key, expList)
      expMap.set(re, value)
    }
    loaded = true
  }
  const wordMaps = [nounMap, noteMap, nameMap]
  let { itemMap } = await getItem()
  textMap = new Map([...itemMap, ...textMap])
  return { expMap, wordMaps, textMap }
}

export default getMission
