import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trimWrap, trim } from '../utils/index'
import tagText from '../utils/tagText'

const storyTemp = new Map()
const storyTitle = new Map()
const commStoryMap = new Map()
let commStoryLoaded = false
let storyIndex = null

const collectStoryTitle = (data) => {
  if (data.communications && data.communications.length) {
    data.communications.forEach(item => {
      storyTitle.set(item.communicationId, item.title)
    })
  } else if (data.idol && data.idol.produceIdolEvents) {
    data.idol.produceIdolEvents.forEach(item => {
      storyTitle.set(item.id, item.title)
    })
    data.idol.produceAfterEvents.forEach(item => {
      storyTitle.set(item.id, item.title)
    })
  } else if (data.supportIdol && data.supportIdol.produceSupportIdolEvents) {
    data.supportIdol.produceSupportIdolEvents.forEach(item => {
      storyTitle.set(item.id, item.title)
    })
  } else if (data.gameEvents) {
    data.gameEvents.forEach(events => {
      events.communications.forEach(item => {
        storyTitle.set(item.id, `${item.name} ${item.title}`)
      })
    })
  } else if (data.specialEvents) {
    data.specialEvents.forEach(events => {
      events.communications.forEach(item => {
        storyTitle.set(item.id, `${item.name} ${item.title}`)
      })
    })
  }
  return storyTitle
}

const getStoryMap = (csv) => {
  const list = parseCsv(csv)
  const storyMap = new Map()
  list.forEach(item => {
    const id = trim(item.id)
    const text = trimWrap(item.text)
    const trans = trimWrap(item.trans, true)
    const name = trim(item.name)
    if (text && trans) {
      if (id && !/^0+$/.test(id) && !storyMap.has(id) && id !== 'select') {
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

export { getStoryMap, storyTitle, collectStoryTitle, getCommStory }
export default getStory
