import { getList } from './index'
import { trimWrap } from '../utils/index'

const phraseMap = new Map()
let loaded = false

const getPhrase = async (full = false) => {
  if (!loaded) {
    const list = await getList('phrase')
    list.forEach(item => {
      if (item?.id) {
        const id = trimWrap(item.id)
        const trans = trimWrap(item.trans, true)
        if (id) {
          if (full) {
            phraseMap.set(id, item.trans)
          } else if (trans) {
            phraseMap.set(id, trans)
          }
        }
      }
    })
    loaded = true
  }

  return phraseMap
}

export default getPhrase
