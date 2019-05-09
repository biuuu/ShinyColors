import { MODULE_ID } from '../config'
import { log, replaceWrap } from '../utils/index'
import config from '../config'
import showStoryTool from '../utils/story-tool'

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

const storyCache = {
  name: '',
  filename: '',
  list: ''
}
const saveData = (data, name) => {
  const filename = name.replace(/\//g, '-')
  const list = []
  data.forEach(item => {
    let text = replaceWrap(item.text)
    if (text && text.trim()) {
      list.push({
        id: item.id || '0',
        name: item.speaker || '',
        text,
        trans: ''
      })
    } else if (item.select) {
      list.push({
        id: 'select',
        name: '',
        text: replaceWrap(item.select),
        trans: ''
      })
    }
  })
  list.push({
    id: 'info', name, text: '', trans: ''
  })
  storyCache.name = name
  storyCache.filename = `${filename}.csv`
  storyCache.list = list
}

const transScenario = async () => {
  const scnModule = getModule()
  if (!scnModule) return
  const originLoad = scnModule.load
  scnModule.load = async function (...args) {
    const res = await originLoad.apply(this, args)
    log('scenario', ...args, res)
    const type = args[0]
    if (!type) return res
    if (type.includes('/produce_events/') ||
      type.includes('/produce_communications/') ||
      type.includes('/produce_communications_promises/') ||
      type.includes('/produce_communication_promise_results/') ||
      type.includes('/game_event_communications/') ||
      type.includes('/special_communications/')

    ) {
      const name = type.replace(/^\/assets\/json\//, '')
      if (config.story === 'edit') {
        saveData(res, name)
        showStoryTool(storyCache)
      }
    }
    return res
  }
}

export default transScenario
