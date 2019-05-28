import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trimWrap } from '../utils/index'
import getItem from './item'

let commonMap = new Map()
let loaded = false

const getCommMap = async () => {
  if (!loaded) {
    let csv = await getLocalData('common')
    if (!csv) {
      csv = await fetchData('/data/common.csv')
      setLocalData('common', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      if (item && item.ja) {
        const _ja = trimWrap(item.ja)
        const _zh = trimWrap(item.zh)
        if (_ja && _zh) {
          commonMap.set(_ja, _zh)
        }
      }
    })
    const { itemMap } = await getItem()
    commonMap = new Map([...itemMap, ...commonMap])
    loaded = true
  }

  return commonMap
}

export default getCommMap
