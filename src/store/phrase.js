import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trim } from '../utils/index'

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
      if (item && item.name) {
        const _name = trim(item.name)
        const _zh = trim(item.zh)
        if (_name && (_zh || full)) {
          phraseMap.set(_name, _zh)
        }
      }
    })
    loaded = true
  }

  return phraseMap
}

export default getPhrase
