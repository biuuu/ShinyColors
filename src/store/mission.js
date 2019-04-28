import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trim } from '../utils/index'

const missionMap = new Map()
let loaded = false

const getMission = async () => {
  if (!loaded) {
    let csv = await getLocalData('mission')
    if (!csv) {
      csv = await fetchData('/data/mission.csv')
      setLocalData('mission', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      if (item && item.ja) {
        const ja = trim(item.ja)
        const zh = trim(item.zh)
        if (ja && zh) {
          missionMap.set(ja, zh)
        }
      }
    })
    loaded = true
  }

  return missionMap
}

export default getMission
