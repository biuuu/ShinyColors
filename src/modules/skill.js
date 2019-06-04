import replaceText from '../utils/replaceText'
import { getSupportSkill } from '../store/skill'
import tagText from '../utils/tagText'

const transSkill = async (data) => {
  const { expMap, wordMaps } = await getSupportSkill()
  const sskill = data.supportSkills
  const asskill = data.acquiredSupportSkills
  sskill.forEach(item => {
    item.description = tagText(replaceText(item.description, expMap, wordMaps))
  })
  asskill && asskill.forEach(item => {
    item.description = tagText(replaceText(item.description, expMap, wordMaps))
  })
}

export default transSkill
