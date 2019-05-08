import { MODULE_ID } from '../config'
import { log } from '../utils/index'

const getModule = () => {
  let scnModule
  try {
    const moduleLoadScenario = primJsp([],[],[MODULE_ID.SCENARIO])
    scnModule = moduleLoadScenario.default
    if (
      !moduleLoadScenario.default['load']
      || !moduleLoadScenario.default['_errorEvent']
      || !moduleLoadScenario.default['_handleError']
    ) {
      throw new Error('模块不匹配')
    }
  } catch (e) {
    log(e)
  }
  return scnModule
}

const transScenario = async () => {
  const scnModule = getModule()
  if (!scnModule) return
  const originLoad = scnModule.load
  scnModule.load = async function (...args) {
    log('scenario', ...args)
    return originLoad.apply(this, args)
  }
}

export default transScenario
