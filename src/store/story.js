import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getList, getLocalData, setLocalData } from './index'
import { trimWrap, trim, uniqueStoryId } from '../utils/index'
import config from '../config'

const storyTemp = new Map()
const aiStoryTemp = new Map()
const commStoryMap = new Map()
let commStoryLoaded = false
let storyIndex = null
let aiStoryIndex = null

const getStoryMap = (csv, isAI) => {
  const list = parseCsv(csv)
  const storyMap = new Map()
  const getId = uniqueStoryId()
  let aiHint = false
  const translator = list.find(item => {
    return item.id === '译者'
  }).name || ''
  list.forEach(item => {
    const id = getId(trim(item.id))
    const text = trimWrap(item.text)
    let trans = trimWrap(item.trans, true)
    const name = trim(item.name)
    if (text && trans) {
      if (!aiHint) {
        aiHint = true
        trans = `[${translator}(LLM)机翻]${trans}`
      }
      if (id && !/^0+$/.test(id) && id !== 'select') {
        storyMap.set(id, trans)
      } else {
        if (id === 'select') {
          storyMap.set(`${text}-select`, trans)
        } else {
          storyMap.set(text, trans)
        }
      }
    }
    if (id && name && id === 'info') {
      storyMap.set('name', name)
    }
  })
  return storyMap
}

const getStory = async (name) => {
  if (!storyIndex) {
    let storyIndexStr = await getLocalData('story.json')
    if (!storyIndexStr) {
      const storyIndexData = await fetchData('/story.json')
      storyIndex = new Map(storyIndexData)
      setLocalData('story.json', JSON.stringify(storyIndex))
    } else {
      storyIndex = new Map(JSON.parse(storyIndexStr))
    }
  }
  if (storyIndex.has(name)) {
    if (storyTemp.has(name)) {
      return storyTemp.get(name)
    } else {
      const fileName = storyIndex.get(name)
      const csvStr = await fetchData(`/data/story/${fileName}.csv`)
      const storyMap = getStoryMap(csvStr)
      storyTemp.set(name, storyMap)
      return storyMap
    }
  }

  return false
}

const getAIStory = async (name) => {
  if (!aiStoryIndex) {
    let aiStoryIndexStr = await getLocalData('story-ai.json')
    if (!aiStoryIndexStr) {
      const aiStoryIndexData = await fetchData(`${config.ai_host}/story.json`)
      aiStoryIndex = new Map(aiStoryIndexData)
      setLocalData('story-ai.json', JSON.stringify(aiStoryIndex))
    } else {
      aiStoryIndex = new Map(JSON.parse(aiStoryIndexStr))
    }
  }
  if (aiStoryIndex.has(name)) {
    if (aiStoryTemp.has(name)) {
      return aiStoryTemp.get(name)
    } else {
      const fileName = aiStoryIndex.get(name)
      const csvStr = await fetchData(`${config.ai_host}/story/${fileName}.csv`)
      const storyMap = getStoryMap(csvStr)
      aiStoryTemp.set(name, storyMap)
      return storyMap
    }
  }

  return false
}

const getCommStory = async () => {
  if (!commStoryLoaded) {
    const list = await getList('comm-story')
    list.forEach(item => {
      if (item?.text) {
        const text = trimWrap(item.text)
        const trans = trimWrap(item.trans, true)
        if (text && trans && text !== trans) {
          commStoryMap.set(text, trans)
        }
      }
    })
    commStoryLoaded = true
  }

  return commStoryMap
}

export { getStoryMap, getCommStory, getAIStory }
export default getStory
