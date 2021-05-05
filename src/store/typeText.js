import { commonStore } from './index'
import { getCommStory } from './story'
import getName from './name'

let typeTextMap = null
let loaded = false

const getBaseMap = commonStore({
  name: 'type-text'
})

const getTypeTextMap = async () => {
  if (!loaded) {
    typeTextMap = await getBaseMap()
    const commStoryMap = await getCommStory()
    const nameMap = await getName()
    typeTextMap = new Map([...commStoryMap, ...typeTextMap, ...nameMap])
    loaded = true
  }

  return typeTextMap
}

export default getTypeTextMap
