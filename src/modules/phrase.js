import getPhrase from '../store/phrase'
import { MODULE_ID } from '../config'
import tagText from '../utils/tagText'
import { log } from '../utils/index'

let phraseMap = null
const getPhraseObj = () => {
  let phrases
  try {
    const modulePhrases = primJsp([],[],[MODULE_ID.PHRASE])
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
      list.push(`${key},${obj[key].replace(/\r?\n|\r/g, '\\n')}`)
    }
  }
  log(list.join(',\n'))
}

export default async function transPhrase () {
  const obj = getPhraseObj()
  if (!obj) return
  // if (ENVIRONMENT === 'development') {
  //   phraseMap = await getPhrase(true)
  //   collectPhrases(obj)
  // }
  phraseMap = await getPhrase()
  for (let [key, value] of phraseMap) {
    obj[key] = tagText(value)
  }
}
