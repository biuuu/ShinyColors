import { commonStore } from './index'
import getItem from './item'
import getName from './name'

let loaded = false

const getBaseMap = commonStore({
  name: 'common'
})

const getCommMap = async () => {
  if (!loaded) {
    const commonMap = await getBaseMap()
    const { itemMap } = await getItem()
    const nameMap = await getName()
    commonMap = new Map([...itemMap, ...nameMap, ...commonMap])
    loaded = true
  }

  return commonMap
}

export default getCommMap
