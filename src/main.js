import transPhrase from './modules/phrase'
import watchText from './modules/text'
import { restoreConsole } from './utils/index'

const main = () => {
  transPhrase()
  watchText()
  GLOBAL && (GLOBAL.console = restoreConsole())
}

window.addEventListener('load', main)
