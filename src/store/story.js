import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trimWrap, trim, uniqueStoryId } from '../utils/index'
import tagText from '../utils/tagText'

const storyTemp = new Map()
const commStoryMap = new Map()
let commStoryLoaded = false
let storyIndex = null

const getStoryMap = (csv) => {
  const list = parseCsv(csv)
  const storyMap = new Map()
  const getId = uniqueStoryId()
  list.forEach(item => {
    const id = getId(trim(item.id))
    const text = trimWrap(item.text)
    const trans = trimWrap(item.trans, true)
    const name = trim(item.name)
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
    if (id && name && id === 'info') {
      storyMap.set('name', name)
    }
  })
  return storyMap
}

const getStory = async (name) => {
  if (!storyIndex) {
    let storyIndexStr = await getLocalData('story-map.json')
    if (!storyIndexStr) {
      const storyIndexData = await fetchData('/story-map.json')
      storyIndex = new Map(storyIndexData)
      setLocalData('story-map.json', JSON.stringify(storyIndex))
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

const getCommStory = async () => {
  if (!commStoryLoaded) {
    let csv = await getLocalData('comm-story')
    if (!csv) {
      csv = await fetchData('/data/comm-story.csv')
      setLocalData('comm-story', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      if (item && item.ja) {
        const _ja = trimWrap(item.ja)
        const _zh = trimWrap(item.zh, true)
        if (_ja && _zh && _ja !== _zh) {
          commStoryMap.set(_ja, _zh)
        }
      }
    })
    commStoryLoaded = true
  }

  return commStoryMap
}

export { getStoryMap, getCommStory }
export default getStory
