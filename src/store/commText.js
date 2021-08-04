import { commonStore } from './index'
import { getIdolName } from './name'

let loaded = false
let commonMap = null

const getBaseMap = commonStore({
  name: 'common'
})

const getCommMap = async () => {
  if (!loaded) {
    commonMap = await getBaseMap()
    const nameMap = await getIdolName()
    commonMap = new Map([...nameMap, ...commonMap])
    loaded = true
  }

  return commonMap
}

export default getCommMap
