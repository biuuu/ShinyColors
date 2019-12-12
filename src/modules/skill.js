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
  let obj = data
  if (data.userSupportIdol) obj = data.userSupportIdol
  const { expMap, wordMaps } = await getSupportSkill()
  const sskill = obj.supportSkills || obj.supportIdol.supportSkills
  const asskill = obj.acquiredSupportSkills
  sskill && sskill.forEach(item => {
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

const exSkill = (data) => {
  transSkill(data, 'name', skillData)
  transSkill(data, 'description', skillData)
}

const skillPanel = (data, skillData) => {
  if (!data) return
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

const shortProIdol = (data, skillData) => {
  data.userProduceIdol.activeSkills.forEach(item => {
    skillWithLink(item, skillData)
  })
  data.userProduceIdol.passiveSkills.forEach(item => {
    skillWithLink(item, skillData)
  })
}

// request entry
const userIdolsSkill = async (data) => {
  const skillData = await ensureSkillData()
  skillPanel(data.idol.skillPanels, skillData)
  memoryAppeal(data.idol.memoryAppeals, skillData)
  data.userIdolProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill, skillData)
  })
}

const userProIdolsSkill = async (data) => {
  const skillData = await ensureSkillData()
  data.activeSkills.forEach(item => {
    skillWithLink(item, skillData)
  })
  memoryAppeal(data.userIdol.idol.memoryAppeals, skillData)
  data.userProduceIdolProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill, skillData)
  })
}

const reserveUserIdolsSkill = async (data) => {
  const skillData = await ensureSkillData()
  skillPanel(data.idol.skillPanels, skillData)
  memoryAppeal(data.idol.memoryAppeals, skillData)
}

const userSptIdolsSkill = async (data) => {
  const skillData = await ensureSkillData()
  skillPanel(data.supportIdol.skillPanels, skillData)
  data.userSupportIdolProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill, skillData)
  })
  try {
    data.supportIdol.supportIdolActiveSkill.activeSkills.forEach(item => {
      transSkill(item, 'comment', skillData)
      transSkill(item, 'name', skillData)
    })
  } catch (e) {}
}

const userProSptIdolsSkill = async (data) => {
  const skillData = await ensureSkillData()
  skillPanel(data.skillPanels, skillData)
  data.userProduceSupportIdolProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill, skillData)
  })
  try {
    data.userSupportIdol.supportIdol.supportIdolActiveSkill.activeSkills.forEach(item => {
      transSkill(item, 'comment', skillData)
      transSkill(item, 'name', skillData)
    })
  } catch (e) {}
}

const reserveUserSptIdolsSkill = async (data) => {
  const skillData = await ensureSkillData()
  skillPanel(data.supportIdol.skillPanels, skillData)
  try {
    data.supportIdol.supportIdolActiveSkill.activeSkills.forEach(item => {
      transSkill(item, 'comment', skillData)
      transSkill(item, 'name', skillData)
    })
  } catch (e) {}
}

const userFesIdolsSkill = async (data) => {
  const skillData = await ensureSkillData()
  const fesIdol = data.userFesIdol
  fesIdol.activeSkills.forEach(item => {
    skillWithLink(item, skillData)
  })
  skillWithLink(fesIdol.memoryAppeal, skillData)
  fesIdol.passiveSkills.forEach(item => {
    transSkill(item, 'comment', skillData)
    transSkill(item, 'name', skillData)
  })
  fesIdol.userFesIdolProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill, skillData)
  })
  fesIdol.userFesSupportIdols.forEach(sptIdol => {
    sptIdol.userFesSupportIdolProduceExSkills.forEach(item => {
      exSkill(item.produceExSkill, skillData)
    })
  })
}

const otherFesIdolSkill = userFesIdolsSkill

const produceExSkillTop = async (data) => {
  const skillData = await ensureSkillData()
  data.userProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill, skillData)
  })
}

const userFesDeck = async (data) => {
  const skillData = await ensureSkillData()
  data.userFesDecks.forEach(deck => {
    deck.userFesDeckMembers.forEach(member => {
      member.userFesIdol.activeSkills.forEach(item => {
        skillWithLink(item, skillData)
      })
    })
  })
}

const proSkillPanels = async (data) => {
  const skillData = await ensureSkillData()
  data.userProduceSupportIdols.forEach(item => {
    skillPanel(item.skillPanels, skillData)
  })
  shortProIdol(data, skillData)
}

const produceFinish = async (data) => {
  const skillData = await ensureSkillData()
  shortProIdol(data, skillData)
}

export {
  supportSkill, userIdolsSkill, produceExSkillTop,
  userFesIdolsSkill, userSptIdolsSkill, reserveUserIdolsSkill,
  reserveUserSptIdolsSkill, otherFesIdolSkill, userFesDeck, userProIdolsSkill,
  userProSptIdolsSkill, proSkillPanels, produceFinish
}
