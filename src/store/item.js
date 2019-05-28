import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trimWrap, trim } from '../utils/index'

const itemMap = new Map()
const itemLimitMap = new Map()
let loaded = false

const getItem = async () => {
  if (!loaded) {
    let csv = await getLocalData('item')
    if (!csv) {
      csv = await fetchData('/data/item.csv')
      setLocalData('item', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      if (item && item.text) {
        const text = trim(item.text, true)
        const trans = trimWrap(item.trans, true)
        const type = trim(item.type, true) || 'normal'
        if (text && trans) {
          if (type === 'limit') {
            itemLimitMap.set(text, trans)
          } else {
            itemMap.set(text, trans)
          }
        }
      }
    })
    loaded = true
  }

  return { itemMap, itemLimitMap }
}

export default getItem
