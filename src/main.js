import transPhrase from './modules/phrase'
import watchText from './modules/text'
import requestHook from './modules/request'
import resourceHook from './modules/resourse'
import transScenario from './modules/scenario'
import addFont from './utils/fontFace'
import './utils/keepBgm'
import './utils/fixModule'
import { log, sleep } from './utils/index'

const main = async () => {
  try {
    await Promise.all([resourceHook(), addFont(), transPhrase(), watchText(), requestHook(), transScenario()])
  } catch (e) {
    log(e)
  }
}

let waitCount = 0
const start = async () => {
  if ((window.unsafeWindow && window.unsafeWindow.ezg || window.ezg) && waitCount < 300) {
    await sleep(100)
    waitCount++
    if (waitCount % 10 === 0) log(`Waiting: ${waitCount / 10}s`)
    await start()
  } else {
    main()
  }
}

if (document.readyState != 'loading') {
  start()
} else {
  if (window.unsafeWindow) {
    window.unsafeWindow.addEventListener('DOMContentLoaded', start)
  } else {
    window.addEventListener('DOMContentLoaded', start)
  }
}