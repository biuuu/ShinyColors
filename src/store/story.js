import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trimWrap, trim, removeWrap } from '../utils/index'
import tagText from '../utils/tagText'

const storyTemp = new Map()
let storyIndex = null

const getStoryMap = (csv) => {
  const list = parseCsv(csv)
  const storyMap = new Map()
  list.forEach(item => {
    const id = trim(item.id, true)
    const text = removeWrap(trimWrap(item.text))
    const trans = trimWrap(item.trans)
    if (text && trans) {
      if (id && !/^0+$/.test(id) && id !== 'select') {
        storyMap.set(id, tagText(trans))
      } else {
        if (id === 'select') {
          storyMap.set(`${text}-select`, tagText(trans))
        } else {
          storyMap.set(text, tagText(trans))
        }
      }
    }
  })
  return storyMap
}

const getStory = async (name) => {
  if (!storyIndex) {
    let storyIndexStr = await getLocalData('story-index')
    if (!storyIndexStr) {
      const storyIndexData = await fetchData('/story.json')
      storyIndex = new Map(storyIndexData)
      setLocalData('story-index', JSON.stringify(storyIndexStr))
    } else {
      storyIndex = new Map(JSON.parse(storyIndexStr))
    }
  }
  if (storyIndex.has(name)) {
    if (storyTemp.has(name)) {
      return storyTemp.get(name)
    } else {
      const csvPath = storyIndex.get(name)
      const csvStr = await fetchData(csvPath)
      const storyMap = getStoryMap(csvStr)
      storyTemp.set(name, storyMap)
      return storyMap
    }
  }

  return false
}

export default getStory
