import getPhrase from '../store/phrase'
import { MODULE_ID } from '../config'
import tagText from '../utils/tagText'

const getPhraseObj = () => {
  let phrases
  try {
    const modulePhrases = primJsp([],[],[MODULE_ID.PHRASE])
    phrases = modulePhrases.default._polyglot.phrases
  } catch (e) {
    console.log(e)
  }
  return phrases
}

export default async function transPhrase () {
  const phraseMap = await getPhrase()
  const obj = getPhraseObj()
  if (!obj) return
  for (let [key, value] of phraseMap) {
    let _value = value.replace(/\\[rn]/g, '\n')
    obj[key] = tagText(_value)
  }
}
