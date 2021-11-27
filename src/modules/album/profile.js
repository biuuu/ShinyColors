import getProfile from '../../store/profile'
import { getIdolName } from '../../store/name'
import { router } from '../request'
import { getModule } from '../get-module'
import tagText from '../../utils/tagText'

let profileKeyTransed = false
const transProfileKeys = async () => {
  if (profileKeyTransed) return
  profileKeyTransed = true
  const profileMap = await getProfile()
  const labelMap = profileMap.get('label')
  const list = await getModule('PROFILE_KEY')
  for (let [key, name] of labelMap) {
    const data = list.find(item => item.name === key)
    if (data?.children) {
      const profileKeyObj = data.children.find(obj => obj.name === 'title')
      if (profileKeyObj) {
        profileKeyObj.text = name
      }
    }
  }
}

const transName = async (data) => {
  const idolName = await getIdolName()
  if (idolName.has(data.name)) {
    data.name = tagText(idolName.get(data.name))
  }
  if (idolName.has(data.firstName)) {
    data.firstName = idolName.get(data.firstName)
  }
}

const transProfile = async (data) => {
  const profileMap = await getProfile()
  await transName(data)
  const textData = profileMap.get(data.id)
  for (let key in textData) {
    if (key !== 'id' && data[key]) {
      if (key === 'unit') {
        data.unit.name = textData[key]
      } else {
        data[key] = textData[key]
      }
    }
  }
  transProfileKeys()
}

router.post('characterAlbums/characters/{num}', transProfile)