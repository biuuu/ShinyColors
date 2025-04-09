import { log, replaceWrap, fixWrap, trim, uniqueStoryId } from '../utils/index'
import config from '../config'
import showStoryTool from '../utils/story-tool'
import getStory, { getCommStory, getAIStory } from '../store/story'
import { storyTitle } from './album/title'
import transSpeaker from './story/speaker'
import autoTrans from '../utils/translation'
import { requestLog } from './request'
import { getModule } from './get-module'
import showAiTransHint from '../utils/aiTransHint'
import { setStoryMap } from './story/trackStory'
import { getTextTrans, getSelectTrans } from './story/utils'

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
  return res?.[1] ?? ''
}
const saveData = (data, name) => {
  const _name = name.replace('.json', '')
  const _cid = getCid(_name)
  let filename = storyTitle.get(_cid) || _name.replace(/\//g, '_')
  filename = filename.replace('\u200b', '')
  const list = []
  data.forEach(item => {
    let text = trim(replaceWrap(item.text))
    if (text?.trim()) {
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

const startTrans = (data, storyMap, commMap) => {
  setStoryMap(null, null)
  if (config.transCover === 'on') {
    setStoryMap(storyMap, commMap)
  }
  const getId = uniqueStoryId()
  data.forEach(item => {
    if (item.text && config.transCover !== 'on') {
      const trans = getTextTrans(getId, storyMap, commMap, item)
      if (trans) item.text = trans
    }
    if (item.select) {
      const trans = getSelectTrans(storyMap, commMap, item)
      if (trans) item.select = trans
    }
  })
  if (storyMap.has('isAI')) {
    showAiTransHint(storyMap.get('isAI'))
  }
}

const transStory = async () => {
  const scnModule = await getModule('SCENARIO')
  const originLoad = scnModule.load
  scnModule.load = async function (...args) {
    const res = await originLoad.apply(this, args)
    const type = args[0]
    if (!type) return res
    if (config.dev && type.includes('/assets/json/')) requestLog('STORY', '#ad37c2', args, res)
    if (type.includes('/produce_events/') ||
      type.includes('/produce_communications/') ||
      type.includes('/produce_communications_promises/') ||
      type.includes('/produce_communication_promise_results/') ||
      type.includes('/game_event_communications/') ||
      type.includes('/special_communications/') ||
      type.includes('/mypage_communications/') ||
      type.includes('/produce_communication_cheers/') ||
      type.includes('/produce_communication_auditions/') ||
      type.includes('/produce_communication_televisions/') ||
      type.includes('/business_unit_communication/')
    ) {
      try {
        setStoryMap(null)
        if (!Array.isArray(res)) return res
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
        const commMap = await getCommStory()
        if (storyMap) {
          startTrans(res, storyMap, commMap)
        } else if (config.auto === 'on') {
          let aiStoryMap = await getAIStory(name)
          if (aiStoryMap) {
            startTrans(res, aiStoryMap, commMap)
          } else {
            await autoTrans(res, name)
          }
        } else {
          await autoTrans(res, name, false, true)
        }
        for (let item of res) {
          await transSpeaker(item)
        }
      } catch (e) {
        log(e)
      }
    }
    return res
  }
}

export default transStory
