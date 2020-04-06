import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trimWrap } from '../utils/index'
import { getCommStory } from './story'

let typeTextMap = new Map()
let loaded = false

const getTypeTextMap = async () => {
  if (!loaded) {
    let csv = await getLocalData('type-text')
    if (!csv) {
      csv = await fetchData('/data/type-text.csv')
      setLocalData('type-text', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      if (item && item.ja) {
        const _ja = trimWrap(item.ja)
        const _zh = trimWrap(item.zh, true)
        if (_ja && _zh && _ja !== _zh) {
          typeTextMap.set(_ja, _zh)
        }
      }
    })
    const commStoryMap = await getCommStory()
    typeTextMap = new Map([...commStoryMap, ...typeTextMap])
    loaded = true
  }

  return typeTextMap
}

export default getTypeTextMap
