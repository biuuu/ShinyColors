import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trimWrap } from '../utils/index'
import tagText from '../utils/tagText'

const phraseMap = new Map()
let loaded = false

const getPhrase = async (full = false) => {
  if (!loaded) {
    let csv = await getLocalData('phrase')
    if (!csv) {
      csv = await fetchData('/data/phrase.csv')
      setLocalData('phrase', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      if (item && item.id) {
        const id = trimWrap(item.id)
        const trans = trimWrap(item.trans, true)
        if (id) {
          if (full) {
            phraseMap.set(id, item.trans)
          } else if (trans) {
            phraseMap.set(id, tagText(trans))
          }
        }
      }
    })
    loaded = true
  }

  return phraseMap
}

export default getPhrase
