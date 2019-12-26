var log
if (!log) {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  log = iframe.contentWindow.console.log
}

const getModule = async (name, condition) => {
  for (let i = 1; i < 500; i++) {
    let module = primJsp([], [], [i])
    if (module && condition(module)) {
      log(`${name}: ${i}`)
      break
    }
  }
}

getModule('REQUEST', (module) => {
  return module.default && module.default.get && module.default.post && module.default.put && module.default.patch
})
getModule('PHRASE', (module) => {
  return module.default && module.default._polyglot && module.default._polyglot.phrases
})
getModule('SCENARIO', (module) => {
  return module.default && module.default['load'] && module.default['_errorEvent'] && module.default['_handleError']
})