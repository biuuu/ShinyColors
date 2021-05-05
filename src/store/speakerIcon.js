import { getList } from './index'
import { trim } from '../utils/index'

const iconMap = new Map()
const subIconMap = new Map()
let loaded = false

const getSpeakerIcon = async () => {
  if (!loaded) {
    const list = await getList('speaker-icon')
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
