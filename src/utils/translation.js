import { getNounFix, getCaiyunPrefix } from '../store/text-fix'
import { replaceWords, log, log2, replaceQuote, fixWrap, transSpeaker, replaceWrap } from '../utils/index'
import getName from '../store/name'
import tagText from './tagText'
import { getCommStory } from '../store/story'
import getTypeTextMap from '../store/typeText'
import config from '../config'

const request = (url, option) => {
  const { method = 'GET', headers, data } = option
  return fetch(url, {
    body: data,
    headers, method,
    mode: 'cors',
    referrer: 'no-referrer'
  }).then(res => res.json())
}

const caiyunTrans = async (source, lang = 'ja') => {
  const from = lang === 'en' ? 'en' : 'ja'
  const data = {
    detect: true,
    media: 'text',
    request_id: 'web_fanyi',
    trans_type: `${from}2zh`,
    source
  }
  try {
    const res = await request('https://api.interpreter.caiyunai.com/v1/translator', {
      data: JSON.stringify(data),
      method: 'POST',
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'referer': 'http://www.caiyunapp.com',
        'origin':'http://www.caiyunapp.com',
        'X-Authorization': 'token cy4fgbil24jucmh8jfr5'
      }
    })
    return res.target
  } catch (err) {
    return []
  }
}

const textKeys = [
  'text', 'select', 'comment', 'title',
  'actionComment', 'actionComment2', 'reactionComment',
  'resultLoseComment', 'resultStartComment', 'resultWinComment'
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
    const transList = await caiyunTrans(fixedTextList)
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
