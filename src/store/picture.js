import fetchData from '../utils/fetch'
import { getLocalData, setLocalData } from './index'

let pictureMap = null
export const getPictureMap = async () => {
  if (!pictureMap) {
    let pictureMapStr = await getLocalData('picture.json')
    if (!pictureMapStr) {
      const pictureMapData = await fetchData('/picture.json')
      pictureMap = new Map(pictureMapData)
      setLocalData('picture.json', JSON.stringify(pictureMap))
    } else {
      pictureMap = new Map(JSON.parse(pictureMapStr))
    }
  }
  return pictureMap
}