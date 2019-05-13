import { getNounFix, getCaiyunPrefix } from '../store/text-fix'
import { replaceWords, trim, log, replaceQuote } from '../utils/index'
import tagText from './tagText'

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

const collectText = (data) => {
  const textInfo = []
  const textList = []
  data.forEach((item, index) => {
    if (item.text) {
      textInfo.push({
        key: 'text',
        index
      })
      textList.push(item.text)
    }
    if (item.select) {
      textInfo.push({
        key: 'select',
        index
      })
      textList.push(item.select)
    }
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

const autoTransCache = new Map()

const autoTrans = async (data, nameMap, name) => {
  let fixedTransList
  const { textInfo, textList } = collectText(data)

  if (autoTransCache.has(name)) {
    fixedTransList = autoTransCache.get(name)
  } else {
    const fixedTextList = await preFix(textList)
    const transList = await caiyunTrans(fixedTextList)
    fixedTransList = await nounFix(transList)
    autoTransCache.set(name, fixedTransList)
  }
  if (DEV) {
    let mergedList = []
    textList.forEach((text, index) => {
      mergedList.push(text, fixedTransList[index])
    })
    log(mergedList.join('\n'))
  }
  fixedTransList.forEach((trans, idx) => {
    let _trans = trans
    const { key, index } = textInfo[idx]
    if (key === 'select') {
      if (trans.length > 8 && !trans.includes('\n')) {
        const len = Math.floor(trans.length / 2) + 1
        _trans = trans.slice(0, len) + '\n' + trans.slice(len, trans.length)
      }
    }
    _trans = replaceQuote(_trans)
    data[index][key] = tagText(_trans)
  })
  data.forEach(item => {
    if (item.speaker) {
      const speaker = trim(item.speaker, true)
      if (nameMap.has(speaker)) {
        item.speaker = nameMap.get(speaker)
      }
    }
  })
}

export default autoTrans
