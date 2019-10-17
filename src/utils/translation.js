import isString from 'lodash/isString'
import { getNounFix, getCaiyunPrefix } from '../store/text-fix'
import { replaceWords, log, log2, replaceQuote, fixWrap, transSpeaker, replaceWrap } from '../utils/index'
import { fetchInfo } from './fetch'
import getName from '../store/name'
import tagText from './tagText'
import { getCommStory } from '../store/story'
import getTypeTextMap from '../store/typeText'
import config from '../config'
import request from './request'
import bdsign from './bdsign'

const joinText = (list) => {
  let br = []
  let _list = list.map(text => fixWrap(text))
  _list.forEach((text) => {
    let count = [...text].filter(l => l === '\n').length
    br.push(count)
  })
  let query = _list.join('\n')
  return [query, br]
}

const splitText = (text, WORDS_LIMIT = 4000) => {
  let strTemp = ''
  let arr = []
  let count = 0
  text.split('\n').forEach(txt => {
    strTemp += txt
    count += new Blob([txt]).size
    if (count > WORDS_LIMIT) {
      arr.push(strTemp)
      count = 0
      strTemp = ''
    } else {
      strTemp += '\n'
    }
  })
  if (strTemp) {
    arr.push(strTemp)
  }
  return arr
}

const bdsApi = async (query, from = 'jp') => {
  let formData = new FormData()
  formData.append('from', from)
  formData.append('to', 'zh')
  formData.append('query', query)
  formData.append('transtype', 'realtime')
  formData.append('simple_means_flag', '3')
  formData.append('sign', bdsign(query))
  formData.append('token', fetchInfo.data.bdsign.token || 'b8441b5ad0953d78dbf4c8829bd226d1')
  let res = await request(`https://fanyi.baidu.com/v2transapi?from=${from}&to=zh`, {
    data: formData,
    method: 'POST',
    headers: {
      'accept': '*/*',
      'referer': 'https://fanyi.baidu.com/translate',
      'origin':'https://fanyi.baidu.com'
    }
  })
  if (!isString(res.trans_result.data[0].dst)) {
    throw new Error('trans fail')
  }
  return res.trans_result.data.map(item => item.dst)
}

const baiduTrans = async (source, from = 'jp') => {
  try {
    let [query, br] = joinText(source)
    let textArr = splitText(query)
    let result = await Promise.all(textArr.map(query => bdsApi(query, from)))
    let list = result.reduce((a, b) => a.concat(b))
    let transArr = []
    br.forEach(count => {
      let i = count
      let str = ''
      while (i >= 0) {
        i--
        str += list.shift() + '\n'
      }
      transArr.push(str.slice(0, str.length - 1))
    })
    return transArr
  } catch (e) {
    log(e)
    return []
  }
}

const textKeys = [
  'text', 'select', 'comment', 'title',
  'actionComment', 'actionComment2', 'reactionComment',
  'resultLoseComment', 'resultStartComment', 'resultWinComment',
  'characterComment', 'producerComment', 'comment1', 'comment2'
]
const collectText = (data, commMap, typeTextMap) => {
  const textInfo = []
  const textList = []
  data.forEach((item, index) => {
    textKeys.forEach(key => {
      let text = fixWrap(item[key])
      if (item[key]) {
        if (commMap.has(text)) {
          item[key] = tagText(commMap.get(text))
        } else if (typeTextMap.has(text)) {
          item[key] = tagText(typeTextMap.get(text))
        } else {
          textInfo.push({ key, index })
          textList.push(text)
        }
      }
    })
  })
  return { textInfo, textList }
}

const preFix = async (list) => {
  const cyfMap = await getCaiyunPrefix()
  return list.map(text => {
    return replaceWords(text, cyfMap)
  })
}

const nounFix = async (list) => {
  const nounFixMap = await getNounFix()
  return list.map(text => {
    return replaceWords(text, nounFixMap)
  })
}

const autoWrap = (text, count) => {
  if (text.length > count && !text.includes('\n')) {
    const len = Math.floor(text.length / 2) + 1
    return text.slice(0, len) + '\n' + text.slice(len, text.length)
  }
  return text
}

const autoTransCache = new Map()

const autoTrans = async (data, name, printText) => {
  if (config.auto !== 'on' || !data.length) return
  let fixedTransList
  const commMap = await getCommStory()
  const typeTextMap = await getTypeTextMap()
  const { textInfo, textList } = collectText(data, commMap, typeTextMap)
  if (!textInfo.length) return

  const storyKey = name || data
  let hasCache = false
  if (autoTransCache.has(storyKey)) {
    hasCache = true
    fixedTransList = autoTransCache.get(storyKey)
  } else {
    const fixedTextList = await preFix(textList)
    let transList = []
    
    transList = await baiduTrans(fixedTextList)
    
    fixedTransList = await nounFix(transList)
    autoTransCache.set(storyKey, fixedTransList)
  }
  if (!hasCache && (DEV || !name || printText)) {
    let mergedList = []
    textList.forEach((text, index) => {
      mergedList.push(replaceWrap(text), fixedTransList[index])
    })
    let _log = log
    if (!name || printText) _log = log2
    _log(mergedList.join('\n'))
  }
  fixedTransList.forEach((trans, idx) => {
    let _trans = trans
    const { key, index } = textInfo[idx]

    if (key === 'select') {
      _trans = autoWrap(_trans, 8)
    }
    _trans = replaceQuote(_trans)
    
    if (idx === 0 && !printText) _trans = `${_trans} ☁️`
    data[index][key] = tagText(_trans)
  })
  const nameMap = await getName()
  data.forEach(item => {
    transSpeaker(item, nameMap)
  })
}

export default autoTrans
