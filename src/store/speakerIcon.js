import { getList } from './index'
import { trim } from '../utils/index'

const iconMap = new Map()
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
        iconMap.set(id, name)
      }
    })
    loaded = true
  }

  return { iconMap }
}

export default getSpeakerIcon
