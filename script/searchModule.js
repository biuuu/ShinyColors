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
  return module?.Z?._encryptRequest
})
getModule('PHRASE', (module) => {
  return module?.Z?._polyglot?.phrases
})
getModule('SCENARIO', (module) => {
  return module && module.Z && module.Z['load'] && module.Z['_errorEvent'] && module.Z['_handleError']
})

getModule('WEBP', (module) => {
  return module?.Z?.isSupportedWebP
})