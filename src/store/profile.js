import { getList } from './index'
import { trimWrap, trim } from '../utils/index'

const profileMap = new Map()
let loaded = false

const keys = ['nameKana', 'unit', 'age', 'bloodType', 'birthday', 'starSign', 'height', 'weight', 'figure', 'arm', 'place', 'hobby', 'specialty', 'cv']
const getProfile = async () => {
  if (!loaded) {
    const list = await getList('profile')
    list.forEach(item => {
      if (item?.id) {
        const id = trimWrap(item.id)
        if (id) {
          if (id === 'label') {
            const text = trimWrap(item.nameKana)
            const arr = text.split('|')
            profileMap.set(id, new Map(keys.map((key, idx) => {
              return [key, trim(arr[idx])]
            })))
          } else {
            for (let key in item) {
              item[key] = trimWrap(item[key])
            }
            profileMap.set(id, item)
          }
        }
      }
    })
    loaded = true
  }

  return profileMap
}

export default getProfile
