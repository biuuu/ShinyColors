import transPhrase from './modules/phrase'
import watchText from './modules/text'
import requestHook from './modules/request'
import resourceHook from './modules/resourse'
import transScenario from './modules/scenario'
import addFont from './utils/fontFace'
import { log } from './utils/index'

const main = async () => {
  try {
    await Promise.all([resourceHook(), addFont(), transPhrase(), watchText(), requestHook(), transScenario()])
  } catch (e) {
    log(e)
  }
}

if (window.unsafeWindow) {
  unsafeWindow.addEventListener('load', main)
} else {
  window.addEventListener('load', main)
}