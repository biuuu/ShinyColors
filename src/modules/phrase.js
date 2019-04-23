import getPhrase from '../store/phrase'

const getPhraseObj = () => {
  let phrases
  try {
    const modulePhrases = primJsp([],[],[4])
    phrases = modulePhrases.default._polyglot.phrases
  } catch (e) {
    console.error(e)
  }
  return phrases
}

export default async function transPhrase () {
  const phraseMap = await getPhrase()
  const obj = getPhraseObj()
  if (!obj) return
  for (let [key, value] of phraseMap) {
    obj[key] = value
  }
}
