import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trimWrap } from '../utils/index'
import { getCommStory } from './story'
import getName from './name'

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
      if (item?.text) {
        const text = trimWrap(item.text)
        const trans = trimWrap(item.trans, true)
        if (text && trans && text !== trans) {
          typeTextMap.set(text, trans)
        }
      }
    })
    const commStoryMap = await getCommStory()
    const nameMap = await getName()
    typeTextMap = new Map([...commStoryMap, ...typeTextMap, ...nameMap])
    loaded = true
  }

  return typeTextMap
}

export default getTypeTextMap
