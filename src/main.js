var i = document.createElement('iframe');
i.style.display = 'none';
document.body.appendChild(i);
window.console = i.contentWindow.console;

const main = () => {
  let phrases
  let loadScenario
  try {
    const modulePhrases = primJsp([],[],[4])
    const moduleLoadScenario = primJsp([],[],[119])
    phrases = modulePhrases.default._polyglot.phrases
    loadScenario = moduleLoadScenario.default.load
    if (
      !moduleLoadScenario.default['setErrorEvent']
      || !moduleLoadScenario.default['_errorEvent']
      || !moduleLoadScenario.default['_handleError']
    ) {
      throw new Error('模块不匹配')
    }
  } catch (e) {
    console.error(e)
  }

  if (phrases) {
    for (let key in phrases) {
      phrases[key] = phrases[key].replace('アイドル', '爱抖露')
    }
  }
}

window.addEventListener('load', main)
