import replaceText from '../utils/replaceText'
import { getSupportSkill } from '../store/skill'
import tagText from '../utils/tagText'

const transSkill = async (res) => {
  const supportSkillData = await getSupportSkill()
  const sskill = res.body.supportSkills
  const asskill = res.body.acquiredSupportSkills
  sskill.forEach(item => {
    item.description = tagText(replaceText(item.description, supportSkillData))
  })
  asskill && asskill.forEach(item => {
    item.description = tagText(replaceText(item.description, supportSkillData))
  })
}

export default transSkill
