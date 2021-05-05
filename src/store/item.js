import { getList } from './index'
import { trimWrap, trim } from '../utils/index'

const itemMap = new Map()
const itemLimitMap = new Map()
const itemNoteMap = new Map()
let loaded = false

const getItem = async () => {
  if (!loaded) {
    const list = await getList('item')
    list.forEach(item => {
      if (item?.text) {
        const text = trimWrap(item.text)
        const trans = trimWrap(item.trans, true)
        const type = trim(item.type) || 'normal'
        if (text && trans && text !== trans) {
          if (type === 'limit') {
            itemLimitMap.set(text, trans)
          } else if (type === 'note') {
            itemNoteMap.set(text, trans)
          } else {
            itemMap.set(text, trans)
          }
        }
      }
    })
    loaded = true
  }

  return { itemMap, itemLimitMap, itemNoteMap }
}

export default getItem
