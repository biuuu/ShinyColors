const getModule = async (name, condition) => {
  for (let i = 1; i < 200; i++) {
    let module = _require(i)
    if (module && condition(module)) {
      console.info(`${name}: ${i}`)
      break
    }
  }
}

getModule('REQUEST', (module) => {
  return module.get && module.post && module.put && module.patch
})
getModule('PHRASE', (module) => {
  return module.default && module.default._polyglot && module.default._polyglot.phrases
})
getModule('SCENARIO', (module) => {
  return module.default && module.default['load'] && module.default['_errorEvent'] && module.default['_handleError']
})

getModule('SPEAKER', (module) => {
  return module.default && module.default['getCharacterBackLogIconId']
})