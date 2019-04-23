import transPhrase from './modules/phrase'
import text from './modules/text'
import { restoreConsole } from './utils/index'

const main = () => {
  transPhrase()
  text()
    GLOBAL.console = restoreConsole()

}

window.addEventListener('load', main)
