import transPhrase from './modules/phrase'
import watchText from './modules/text'
import requestHook from './modules/request'
import resourceHook from './modules/resourse'
import { log } from './utils/index'

const main = async () => {
  try {
    await Promise.all([transPhrase(), watchText(), requestHook(), resourceHook()])
  } catch (e) {
    log(e)
  }
}
setTimeout(() => {
  window.addEventListener('load', main)
})
