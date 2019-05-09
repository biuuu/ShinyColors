import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trim } from '../utils/index'
import tagText from '../utils/tagText'

const nameMap = new Map()
let loaded = false

const getName = async () => {
  if (!loaded) {
    let csv = await getLocalData('name')
    if (!csv) {
      csv = await fetchData('/data/name.csv')
      setLocalData('name', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      const name = trim(item.name, true)
      const trans = trim(item.trans, true)
      if (name && trans) {
        nameMap.set(name, tagText(trans))
      }
    })
    loaded = true
  }

  return nameMap
}

export default getName
