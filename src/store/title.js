import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trimWrap, trim } from '../utils/index'
import parseRegExp from '../utils/parseRegExp'

const textMap = new Map()
const reMap = new Map()
const expMap = new Map()
let loaded = false

const getTitle = async () => {
  if (!loaded) {
    let csv = await getLocalData('title')
    if (!csv) {
      csv = await fetchData('/data/title.csv')
      setLocalData('title', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      if (item && item.text) {
        const text = trimWrap(item.text)
        const trans = trimWrap(item.trans, true)
        const type = trim(item.type) || 'text'
        if (text && trans && text !== trans) {
          if (type === 'exp') {
            reMap.set(text, trans)
          } else if (type === 'text') {
            textMap.set(text, trans)
          }
        }
      }
    })
    for (let [key, value] of reMap) {
      const re = parseRegExp(key)
      expMap.set(re, value)
    }
    loaded = true
  }

  return { textMap, expMap }
}

export default getTitle
