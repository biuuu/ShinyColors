const DEFAULT_KEY = 'A'
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
getModule('PHRASE', (module) => {
  return module?.[DEFAULT_KEY]?._polyglot?.phrases
})
getModule('SCENARIO', (module) => {
  return module && module[DEFAULT_KEY] && module[DEFAULT_KEY]['load'] && module[DEFAULT_KEY]['_errorEvent'] && module[DEFAULT_KEY]['_handleError']
})

getModule('WEBP', (module) => {
  return module?.[DEFAULT_KEY]?.isSupportedWebP
})

getModule('TRACK_MANAGER', (module) => {
  return module?.[DEFAULT_KEY]?.TrackManager
})