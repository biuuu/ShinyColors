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

const nameWithPlus = (list, data) => {
  if (data) {
    list.forEach((str, index) => {
      list[index] = str + data[index]
    })
  } else {
    let arr = []
    list.forEach((str, index) => {
      let rgs = str.match(/([＋+]+)$/)
      if (rgs && rgs[1]) {
        arr.push(rgs[1])
        list[index] = str.replace(/[＋+]+$/, '')
      } else {
        arr.push('')
      }
    })
    return arr
  }
}

const transSkill = (item, key, data) => {
  if ( item && item[key]) {
    let arr = item[key].split('/')
    arr.forEach((txt, index) => {
      let plusList = nameWithPlus(arr)
      replaceItem(arr, index, data)
      nameWithPlus(arr, plusList)
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

const skillWithLink = (data, skillData) => {
  if (!data) return
  transSkill(data, 'comment', skillData)
  transSkill(data, 'name', skillData)
  if (data.linkSkill) {
    transSkill(data.linkSkill, 'comment', skillData)
    transSkill(data.linkSkill, 'name', skillData)
  }
}

const skillPanel = (data, skillData) => {
  data.forEach(item => {
    transSkill(item, 'releaseConditions', skillData)
    transSkill(item.passiveSkills, 'comment', skillData)
    transSkill(item.passiveSkills, 'name', skillData)
    skillWithLink(item.skill, skillData)
    skillWithLink(item.concertActiveSkill, skillData)
    if (item.activeSkills.length) {
      item.activeSkills.forEach(skill => {
        skillWithLink(skill, skillData)
      })
    }
  })
}

const memoryAppeal = (data, skillData) => {
  data.forEach(item => {
    skillWithLink(item, skillData)
  })
}

const userIdolsSkill = async (data) => {
  const skillData = await ensureSkillData()
  skillPanel(data.idol.skillPanels, skillData)
  memoryAppeal(data.idol.memoryAppeals, skillData)
}

export {
  supportSkill, userIdolsSkill
}
