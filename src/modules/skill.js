import replaceText from '../utils/replaceText'
import { getSupportSkill } from '../store/skill'
import tagText from '../utils/tagText'

const transSkill = async (data) => {
  let skillData = data
  if (data.userSupportIdol) skillData = data.userSupportIdol
  const { expMap, wordMaps } = await getSupportSkill()
  const sskill = skillData.supportSkills
  const asskill = skillData.acquiredSupportSkills
  sskill.forEach(item => {
    item.description = tagText(replaceText(item.description, expMap, wordMaps))
  })
  asskill && asskill.forEach(item => {
    item.description = tagText(replaceText(item.description, expMap, wordMaps))
  })
}

export default transSkill
