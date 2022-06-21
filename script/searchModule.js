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
  return module?.default?._encryptRequest
})
getModule('PHRASE', (module) => {
  return module?.default?._polyglot?.phrases
})
getModule('SCENARIO', (module) => {
  return module && module.default && module.default['load'] && module.default['_errorEvent'] && module.default['_handleError']
})

getModule('WEBP', (module) => {
  return module?.default?.isSupportedWebP
})