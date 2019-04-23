const transScenario = () => {
  let loadScenario
  try {
    const moduleLoadScenario = primJsp([],[],[119])
    loadScenario = moduleLoadScenario.default.load
    if (
      !moduleLoadScenario.default['setErrorEvent']
      || !moduleLoadScenario.default['_errorEvent']
      || !moduleLoadScenario.default['_handleError']
    ) {
      throw new Error('模块不匹配')
    }
  } catch (e) {
    console.log(e)
  }
}
