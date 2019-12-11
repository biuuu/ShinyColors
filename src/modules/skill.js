import replaceText, { replaceItem } from '../utils/replaceText'
import { getSupportSkill, getSkill } from '../store/skill'
import tagText from '../utils/tagText'

let skillData = null
const ensureSkillData = async () => {
  if (!skillData) {
    skillData = await getSkill()
  }
  return skillData
}

const preItemReplace = (item, key, data) => {
  if ( item && item[key]) {
    let arr = item[key].split('/')
    arr.forEach((txt, index) => {
      replaceItem(arr, index, data)
    })
    item[key] = arr.join('/')
  }
}

const supportSkill = async (data) => {
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

const liveSkill = (data, skillData) => {
  if (!data) return
  preItemReplace(data, 'comment', skillData)
  preItemReplace(data, 'name', skillData)
  if (data.linkSkill) {
    preItemReplace(data.linkSkill, 'comment', skillData)
    preItemReplace(data.linkSkill, 'name', skillData)
  }
}

const skillPanel = (data, skillData) => {
  data.forEach(item => {
    preItemReplace(item, 'releaseConditions', skillData)
    preItemReplace(item.passiveSkills, 'comment', skillData)
    preItemReplace(item.passiveSkills, 'name', skillData)
    liveSkill(item.skill, skillData)
    liveSkill(item.concertActiveSkill, skillData)
    if (item.activeSkills.length) {
      item.activeSkills.forEach(skill => {
        liveSkill(skill, skillData)
      })
    }
  })
}

const userIdolsSkill = async (data) => {
  const skillData = await ensureSkillData()
  skillPanel(data.idol.skillPanels, skillData)
}

export {
  supportSkill, userIdolsSkill
}
