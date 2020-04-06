import getPhrase from '../store/phrase'
import CSV from 'papaparse/papaparse.min'
import { replaceWrap, log } from '../utils/index'
import { getPhraseMd } from './get-module'
let phraseMap = null

const collectPhrases = (obj) => {
  let list = []
  for (let key in obj) {
    if (obj[key].trim() && !key.includes('license')) {
      list.push({
        name: key,
        ja: replaceWrap(obj[key]),
        zh: (replaceWrap(phraseMap.get(key)) || '').replace(/^\u200b/, '')
      })
    }
  }
  log(CSV.unparse(list))
}

export default async function transPhrase () {
  const obj = await getPhraseMd()
  if (!obj) return
  // if (ENVIRONMENT === 'development') {
  //   phraseMap = await getPhrase(true)
  //   collectPhrases(obj)
  // }
  phraseMap = await getPhrase()
  for (let [key, value] of phraseMap) {
    obj[key] = value
  }
}
