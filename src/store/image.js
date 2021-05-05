import { getList } from './index'
import { trim } from '../utils/index'

const imageMap = new Map()
let loaded = false

const getImage = async () => {
  if (!loaded) {
    const list = await getList('image')
    list.forEach(item => {
      if (item?.name) {
        const name = trim(item.name)
        const url = trim(item.url)
        const version = trim(item.version) || '1'
        if (name && url) {
          imageMap.set(name, { url, version })
        }
      }
    })
    loaded = true
  }

  return imageMap
}

export default getImage
