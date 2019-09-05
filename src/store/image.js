import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trim } from '../utils/index'

const imageMap = new Map()
let loaded = false

const getImage = async () => {
  if (!loaded) {
    let csv = await getLocalData('image')
    if (!csv) {
      csv = await fetchData('/data/image.csv')
      setLocalData('image', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      if (item && item.name) {
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
