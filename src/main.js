import transPhrase from './modules/phrase'
import watchText from './modules/text'
import requestHook from './modules/request'

const main = async () => {
  try {
    await Promise.all([transPhrase(), watchText(), requestHook()])
  } catch (e) {
    console.log(e)
  }
}

window.addEventListener('load', main)
