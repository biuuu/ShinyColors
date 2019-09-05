import getPhrase from '../store/phrase'
import { getHash } from '../utils/fetch'
import { replaceWrap, log } from '../utils/index'

let phraseMap = null
const getPhraseObj = async () => {
  let phrases
  try {
    const { moduleId } = await getHash
    const modulePhrases = primJsp([],[],[moduleId.PHRASE])
    phrases = modulePhrases.default._polyglot.phrases
  } catch (e) {
    log(e)
  }
  return phrases
}

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
  const obj = await getPhraseObj()
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
