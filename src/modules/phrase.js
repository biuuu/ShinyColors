import getPhrase from '../store/phrase'
import { getHash } from '../utils/fetch'
import { replaceWrap, log } from '../utils/index'
import { getPhraseMd } from './get-module'
let phraseMap = null

const collectPhrases = (obj) => {
  let list = []
  for (let key in obj) {
    if (!phraseMap.has(key) && !key.includes('license')) {
      list.push(`${key},${replaceWrap(obj[key])}`)
    }
  }
  log(list.join(',\n'))
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
