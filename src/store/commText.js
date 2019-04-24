import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trim } from '../utils/index'

const commonMap = new Map()
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
        const _ja = trim(item.ja)
        const _zh = trim(item.zh)
        if (_ja && _zh) {
          commonMap.set(_ja, _zh)
        }
      }
    })
    loaded = true
  }

  return commonMap
}

export default getCommMap
