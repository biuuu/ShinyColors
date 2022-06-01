const getModule = async (name, condition) => {
  for (let i = 1; i < 202000; i++) {
    let module
    try {
      module = _require(i)
    } catch (e) {}

    if (module && condition(module)) {
      console.info(`${name}: ${i}`)
      break
    }
  }
}
getModule('AOBA', (module) => {
  return module && module.loaders && module.Text && module.BLEND_MODES
})
getModule('REQUEST', (module) => {
  return module.get && module.post && module.put && module.patch && module._encryptRequest
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

getModule('WEBP', (module) => {
  return module.default && module.default['isSupportedWebP']
})