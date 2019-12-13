import transPhrase from './modules/phrase'
import watchText from './modules/text'
import requestHook from './modules/request'
import resourceHook from './modules/resourse'
import transScenario from './modules/scenario'
import addFont from './utils/fontFace'
import './utils/keepBgm'
import { log, sleep } from './utils/index'

let errCount = 0
const main = async () => {
  try {
    await Promise.all([resourceHook(), addFont(), transPhrase(), watchText(), requestHook(), transScenario()])
  } catch (e) {
    log(e)
  }
}

const start = async () => {
  log(primEnv)
  main()
}

if (window.unsafeWindow) {
  unsafeWindow.addEventListener('load', start)
} else {
  window.addEventListener('load', start)
}