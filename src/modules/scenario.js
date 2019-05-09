import { MODULE_ID } from '../config'
import { log, replaceWrap, removeWrap, trim } from '../utils/index'
import config from '../config'
import showStoryTool from '../utils/story-tool'
import getStory from '../store/story'
import getName from '../store/name'

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
  const filename = name.replace(/\//g, '_')
  const list = []
  data.forEach(item => {
    let text = trim(replaceWrap(item.text))
    if (text && text.trim()) {
      list.push({
        id: item.id || '0000000000000',
        name: item.speaker || '',
        text,
        trans: ''
      })
    } else if (item.select) {
      list.push({
        id: 'select',
        name: '',
        text: trim(replaceWrap(item.select)),
        trans: ''
      })
    }
  })
  list.push({
    id: 'info', name, text: '', trans: ''
  })
  list.push({
    id: '译者', name: '', text: '', trans: ''
  })
  storyCache.name = name
  storyCache.filename = `${filename}.csv`
  storyCache.list = list
}

const transStory = (data, storyMap, nameMap) => {
  if (!Array.isArray(data)) return
  data.forEach(item => {
    if (item.text) {
      const text = removeWrap(item.text)
      if (item.id) {
        const id = item.id + ''
        if (storyMap.has(id)) {
          item.text = storyMap.get(id)
        }
      } else {
        if (storyMap.has(text)) {
          item.text = storyMap.get(text)
        }
      }
    }
    if (item.select) {
      const select = removeWrap(item.select)
      if (storyMap.has(select)) {
        item.select = storyMap.get(select)
      }
    }
    if (item.speaker) {
      const speaker = trim(item.speaker)
      if (nameMap.has(speaker)) {
        item.speaker = nameMap.get(speaker)
      }
    }
  })
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
      type.includes('/special_communications/') ||
      type.includes('/produce_communication_cheers/') ||
      type.includes('/produce_communication_auditions/')
    ) {
      try {
        const name = type.replace(/^\/assets\/json\//, '')
        if (config.story === 'edit') {
          saveData(res, name)
          showStoryTool(storyCache)
        }
        const storyMap = await getStory(name)
        const nameMap = await getName()
        if (storyMap) {
          transStory(res, storyMap, nameMap)
        }
      } catch (e) {
        log(e)
      }
    }
    return res
  }
}

export default transScenario
