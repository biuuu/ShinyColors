import { log, replaceWrap, fixWrap, trim, transSpeaker, tagStoryText } from '../utils/index'
import config from '../config'
import showStoryTool from '../utils/story-tool'
import getStory, { storyTitle, getCommStory } from '../store/story'
import getName from '../store/name'
import autoTrans from '../utils/translation'
import { requestLog } from './request'
import tagText from '../utils/tagText'
import { getScMd } from './get-module'

const storyCache = {
  name: '',
  filename: '',
  list: '',
  preview: new Map()
}

let previewLoaded = false
const getPreview = () => {
  if (previewLoaded) return
  previewLoaded = true
  const str = sessionStorage.getItem('sczh:preview')
  if (!str) return
  try {
    const arr = JSON.parse(str)
    const map = new Map(arr)
    for (let [key, value] of map) {
      map.set(key, new Map(value))
    }
    storyCache.preview = map
  } catch (e) {
    log(e)
  }
}

const getCid = (name) => {
  const res = name.match(/\/(\d+)$/)
  if (res && res[1]) return res[1]
  return ''
}
const saveData = (data, name) => {
  const _name = name.replace('.json', '')
  const _cid = getCid(_name)
  const filename = storyTitle.get(_cid) || _name.replace(/\//g, '_')
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

const transStory = (data, storyMap, commMap, nameMap) => {
  if (!Array.isArray(data)) return
  data.forEach(item => {
    transSpeaker(item, nameMap)
    if (item.text) {
      const text = fixWrap(item.text)
      if (storyMap.has(text)) {
        item.text = storyMap.get(text)
      } else if (item.id && storyMap.has(`${item.id}`)) {
        item.text = storyMap.get(`${item.id}`)
      } else if (commMap.has(text)) {
        item.text = tagText(commMap.get(text))
      }
    }
    if (item.select) {
      const select = fixWrap(item.select)
      const sKey = `${select}-select`
      if (storyMap.has(sKey)) {
        item.select = storyMap.get(sKey)
      } else if (commMap.has(select)) {
        item.select = tagText(commMap.get(item.select))
      }
    }
  })
}

const transScenario = async () => {
  const scnModule = await getScMd()
  if (!scnModule) return
  const originLoad = scnModule.load
  scnModule.load = async function (...args) {
    const res = await originLoad.apply(this, args)
    const type = args[0]
    if (!type) return res
    if (DEV && type.includes('/assets/json/')) requestLog('STORY', '#ad37c2', args, res)
    if (type.includes('/produce_events/') ||
      type.includes('/produce_communications/') ||
      type.includes('/produce_communications_promises/') ||
      type.includes('/produce_communication_promise_results/') ||
      type.includes('/game_event_communications/') ||
      type.includes('/special_communications/') ||
      type.includes('/produce_communication_cheers/') ||
      type.includes('/produce_communication_auditions/') ||
      type.includes('/produce_communication_televisions/')
    ) {
      try {
        const name = type.replace(/^\/assets\/json\//, '')
        let storyMap
        if (config.story === 'edit') {
          saveData(res, name)
          showStoryTool(storyCache)
        }
        getPreview()
        if (storyCache.preview.has(name)) {
          storyMap = storyCache.preview.get(name)
        } else {
          storyMap = await getStory(name)
        }
        if (storyMap) {
          const commMap = await getCommStory()
          const nameMap = await getName()
          transStory(res, storyMap, commMap, nameMap)
        } else if (config.auto === 'on') {
          await autoTrans(res, name)
        } else {
          await autoTrans(res, name, false, true)
        }
      } catch (e) {
        log(e)
      }
    }
    return res
  }
}

export default transScenario
