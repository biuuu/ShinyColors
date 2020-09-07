import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trim } from '../utils/index'

const iconMap = new Map()
const subIconMap = new Map()
let loaded = false

const getSpeakerIcon = async () => {
  if (!loaded) {
    let csv = await getLocalData('speaker-icon')
    if (!csv) {
      csv = await fetchData('/data/speaker-icon.csv')
      setLocalData('speaker-icon', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      let { name, id, type } = item
      name = trim(name)
      id = trim(id)
      type = trim(type)
      if (name && id) {
        if (type === 'sub') {
          subIconMap.set(name, id)
        } else {
          iconMap.set(name, id)
        }
      }
    })
    loaded = true
  }

  return { iconMap, subIconMap }
}

export default getSpeakerIcon
