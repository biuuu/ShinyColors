import { getList } from './index'
import { trim, pureRE, trimWrap, restoreSpace } from '../utils/index'
import sortWords from '../utils/sortWords'
import parseRegExp from '../utils/parseRegExp'
import { getIdolName } from './name'

const brackets = (str) => {
  return str.replace(/\[/g, '\\[').replace(/\]/g, '\\]')
}

const getCommApiData = (keyword) => {
  let loaded = false
  let allTextMap = new Map()
  let wordMaps = []
  let expMap = new Map()
  return async () => {
    if (!loaded) {
      const list = await getList(keyword)
      const idolMap = await getIdolName()
      const wordMap = new Map()
      const textMap = new Map()
      const reMap = new Map()
      const typeTemp = new Map([
        ['name', [...idolMap.keys()]]
      ])
      const expList = []
      sortWords(list, 'text').forEach(item => {
        if (item?.text) {
          const text = trimWrap(item.text)
          const trans = restoreSpace(trimWrap(item.trans, true))
          const type = trim(item.type)
          if (text && trans) {
            if (typeof type === 'undefined' || type === 'text') {
              textMap.set(text, trans)
            } else if (!type || type === 'exp') {
              reMap.set(brackets(text), trans)
            } else {
              if (!typeTemp.has(type)) {
                typeTemp.set(type, [])
              }
              typeTemp.get(type).push(pureRE(text))
              wordMap.set(text, trans)
            }
          }
        }
      })
      for (let [type, arr] of typeTemp) {
        expList.push({
          re: new RegExp(`\\$${type}`, 'g'),
          exp: `(${arr.join('|')})`
        })
      }
      for (let [key, value] of reMap) {
        const re = parseRegExp(key, expList)
        expMap.set(re, value)
      }
      allTextMap = new Map([...textMap, ...wordMap, ...idolMap])
      wordMaps = [wordMap, idolMap]
      loaded = true
    }
    return { expMap, wordMaps, textMap: allTextMap }
  }
}

export default getCommApiData