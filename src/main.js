import transPhrase from './modules/phrase'
import watchText from './modules/text'
import requestHook from './modules/request'
import resourceHook from './modules/resourse'
import transScenario from './modules/scenario'
import addFont from './utils/fontFace'
import { log } from './utils/index'

const main = async () => {
  try {
    addFont()
    await Promise.all([transPhrase(), watchText(), requestHook(), resourceHook(), transScenario()])
  } catch (e) {
    log(e)
  }
}
setTimeout(() => {
  window.addEventListener('load', main)
})
