import replaceText from '../utils/replaceText'
import { getSupportSkill } from '../store/skill'
import tagText from '../utils/tagText'

const transSkill = async (data) => {
  const supportSkillData = await getSupportSkill()
  const sskill = data.supportSkills
  const asskill = data.acquiredSupportSkills
  sskill.forEach(item => {
    item.description = tagText(replaceText(item.description, supportSkillData))
  })
  asskill && asskill.forEach(item => {
    item.description = tagText(replaceText(item.description, supportSkillData))
  })
}

export default transSkill
