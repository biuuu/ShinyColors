import getProfile from '../../store/profile'
import { getIdolName } from '../../store/name'
import { router } from '../request'

const transName = async (data) => {
  const idolName = await getIdolName()
  if (idolName.has(data.name)) {
    data.name = idolName.get(data.name)
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
}

const albumProfile = async (data) => {
  await transProfile(data)
}

const idolProfile = async (data) => {
  const chara = data.idol.character
  await transProfile(chara)
}

const sIdolProfile = async (data) => {
  const chara = data.supportIdol.character
  await transProfile(chara)
}

const fesIdolProfile = async (data) => {
  const chara = data.userFesIdol.idol.character
  await transProfile(chara)
}

router.post('characterAlbums/characters/{num}', albumProfile)
router.get('userIdols/{num}', idolProfile)
router.get('userSupportIdols/{num}', sIdolProfile)
router.get('userFesIdols/{num}', fesIdolProfile)