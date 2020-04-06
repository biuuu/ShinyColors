import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trim, pureRE, trimWrap } from '../utils/index'
import sortWords from '../utils/sortWords'
import parseRegExp from '../utils/parseRegExp'

const supportSkillCache = {
  expMap: new Map(),
  nounMap: new Map(),
  nounArr: [],
  loaded: false
}

const brackets = (str) => {
  return str.replace(/\[/g, '\\[').replace(/\]/g, '\\]')
}

const getSupportSkill = async () => {
  const { expMap, nounMap, nounArr, loaded } = supportSkillCache
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
        const trans = trimWrap(item.trans, true)
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
    supportSkillCache.loaded = true
  }

  return { expMap, wordMaps: [nounMap] }
}

const skillCache = {
  expMap: new Map(), textMap: new Map(),
  nounMap: new Map(), nameMap: new Map(), otherMap: new Map(),
  nounArr: [], nameArr: [], otherArr: [],
  loaded: false
}

const getSkill = async () => {
  const { expMap, nounMap, textMap, nameMap, otherMap,
     nounArr, nameArr, otherArr, loaded } = skillCache
  if (!loaded) {
    let csv = await getLocalData('skill')
    if (!csv) {
      csv = await fetchData('/data/skill.csv')
      setLocalData('skill', csv)
    }
    const list = parseCsv(csv)
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
    const expList = [
      { re: /\$noun/g, exp: `(${nounArr.join('|')})` },
      { re: /\$name/g, exp: `(${nameArr.join('|')})` },
      { re: /\$other/g, exp: `(${otherArr.join('|')})` }
    ]
    for (let [key, value] of reMap) {
      const re = parseRegExp(key, expList)
      expMap.set(re, value)
    }
    skillCache.loaded = true
  }

  const wordMaps = [nounMap, otherMap, nameMap]
  return { expMap, wordMaps, textMap }
}

export { getSupportSkill, getSkill }
