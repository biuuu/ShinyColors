import isString from 'lodash/isString'
import { getNounFix, getCaiyunPrefix } from '../store/text-fix'
import { replaceWords, log, log2, replaceQuote, fixWrap, replaceWrap, tagStoryText, sess } from '../utils/index'
import { fetchInfo } from './fetch'
import tagText from './tagText'
import { getCommStory } from '../store/story'
import getTypeTextMap from '../store/typeText'
import config from '../config'
import caiyunApi from './caiyun'
import googleApi from './google'

const joinBr = (list, br, transArr) => {
  br.forEach(count => {
    let i = count
    let str = ''
    while (i >= 0) {
      i--
      let _str = list.shift()
      if (isString(_str)) {
        if (!_str) {
          _str = '……'
        }
        str += _str + '\n'
      }
    }
    if (str) {
      transArr.push(str.slice(0, str.length - 1))
    }
  })
}

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
    arr.push(strTemp.replace(/\n$/, ''))
  }
  return arr
}

const caiyunTrans = async (source) => {
  try {
    let limitTime = sess('caiyuLimit')
    if (limitTime && Date.now() - limitTime < 1000 * 60 * 60) {
      return []
    }
    let [query, br] = joinText(source)
    let textArr = splitText(query)
    let result = await Promise.all(textArr.map(query => {
      return caiyunApi(query.split('\n'))
    }))
    let list = result.reduce((a, b) => a.concat(b))
    let transArr = []
    joinBr(list, br, transArr)
    return transArr
  } catch (e) {
    if (e.message === 'Caiyun api out of limit.') {
      sess('caiyuLimit', Date.now())
    }
    log(e)
    return []
  }
}

const googleTrans = async (source) => {
  try {
    let [query, br] = joinText(source)
    let textArr = splitText(query)
    let result = await Promise.all(textArr.map(query => {
      return googleApi(query)
    }))
    let list = result.reduce((a, b) => a.concat(b))
    let transArr = []
    joinBr(list, br, transArr)
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
  return replaceWords(list, cyfMap)
}

const nounFix = async (list) => {
  const nounFixMap = await getNounFix()
  return replaceWords(list, nounFixMap)
}

const autoWrap = (text, count) => {
  if (text.length > count && !text.includes('\n')) {
    const len = Math.floor(text.length / 2) + 1
    return text.slice(0, len) + '\n' + text.slice(len, text.length)
  }
  return text
}

const autoTransCache = new Map()

const autoTrans = async (data, name, printText, skip = false) => {
  if (!data.length) return
  const commMap = await getCommStory()
  const typeTextMap = await getTypeTextMap()
  const { textInfo, textList } = collectText(data, commMap, typeTextMap)
  if (!textInfo.length) return

  const storyKey = name || data
  let hasCache = false
  let fixedTransList = []
  if (autoTransCache.has(storyKey)) {
    hasCache = true
    fixedTransList = autoTransCache.get(storyKey)
  } else {
    let transApi = fetchInfo.data.trans_api
    let transList = []

    if (config.auto === 'on' && !skip) {
      if (transApi === 'caiyun') {
        let fixedTextList = await preFix(textList)
        transList = await caiyunTrans(fixedTextList)
      } else if (transApi === 'google') {
        transList = await googleTrans(textList)
      }
      fixedTransList = await nounFix(transList)
    }

    autoTransCache.set(storyKey, fixedTransList)
  }
  if (!hasCache && (config.dev || !name || printText)) {
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

  tagStoryText(data)
}

export default autoTrans
