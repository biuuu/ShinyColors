import transPhrase from './modules/phrase'
import watchText from './modules/text'
import requestHook from './modules/request'
import { restoreConsole } from './utils/index'

const main = async () => {
  try {
    if (ENVIRONMENT === 'development') {
      GLOBAL && (GLOBAL.console = restoreConsole())
    }
    await Promise.all([transPhrase(), watchText(), requestHook()])
  } catch (e) {
    console.log(e)
  }
}

window.addEventListener('load', main)
