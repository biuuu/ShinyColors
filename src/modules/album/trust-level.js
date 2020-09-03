import { transText } from '../type-text'
import { router } from '../request'

const albumTrustLevel = async (data) => {
  if (data.voices) {
    const list = []
    data.voices.forEach(item => {
      if (item.characterTrustLevelComment) {
        list.push(item.characterTrustLevelComment)
      }
    })
    await transText(list)
  }
}

router.post('characterAlbums/characters/{num}',albumTrustLevel)