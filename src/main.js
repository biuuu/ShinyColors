import transPhrase from './modules/phrase'
import watchText from './modules/text'
import requestHook from './modules/request'
import resourceHook from './modules/resourse'

const main = async () => {
  try {
    await Promise.all([transPhrase(), watchText(), requestHook(), resourceHook()])
  } catch (e) {
    console.log(e)
  }
}

window.addEventListener('load', main)
