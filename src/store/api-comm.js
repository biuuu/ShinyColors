import { getList } from './index'
import { trim, pureRE, trimWrap } from '../utils/index'
import sortWords from '../utils/sortWords'
import parseRegExp from '../utils/parseRegExp'
import { getIdolName } from './name'

const brackets = (str) => {
  return str.replace(/\[/g, '\\[').replace(/\]/g, '\\]')
}

const getCommApiData = (type) => {
  const dataCache = {
    expMap: new Map(), textMap: new Map(),
    nounMap: new Map(), nameMap: new Map(), otherMap: new Map(),
    nounArr: [], nameArr: [], otherArr: [],
    loaded: false
  }
  return async () => {
    let { expMap, nounMap, textMap, nameMap, otherMap,
       nounArr, nameArr, otherArr, loaded } = dataCache
    if (!loaded) {
      const list = await getList(type)
      const idolMap = await getIdolName()
      nameArr = [...idolMap.keys()]
      const reMap = new Map()
      sortWords(list, 'text').forEach(item => {
        if (item?.text) {
          const text = trimWrap(item.text)
          const trans = trimWrap(item.trans, true)
          const type = trim(item.type)
          if (text && trans) {
            if (type === 'noun') {
              nounArr.push(pureRE(text))
              nounMap.set(text, trans)
            } else if (type === 'text') {
              textMap.set(text, trans)
            } else if (type === 'name') {
              nameArr.push(pureRE(text))
              nameMap.set(text, trans)
            } else if (type === 'other') {
              otherArr.push(pureRE(text))
              otherMap.set(text, trans)
            } else {
              reMap.set(brackets(text), trans)
            }
          }
        }
      })

      dataCache.nameMap = new Map([...nameMap, ...idolMap])
      nameMap = dataCache.nameMap
      dataCache.textMap = new Map([...textMap, ...nameMap, nounMap, otherMap])
      textMap = dataCache.textMap
      const expList = [
        { re: /\$noun/g, exp: `(${nounArr.join('|')})` },
        { re: /\$name/g, exp: `(${nameArr.join('|')})` },
        { re: /\$other/g, exp: `(${otherArr.join('|')})` }
      ]
      for (let [key, value] of reMap) {
        const re = parseRegExp(key, expList)
        expMap.set(re, value)
      }
      dataCache.loaded = true
    }

    const wordMaps = [nounMap, otherMap, nameMap]
    return { expMap, wordMaps, textMap }
  }
}

export default getCommApiData