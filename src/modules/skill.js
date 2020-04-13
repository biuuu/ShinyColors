import { replaceItem } from '../utils/replaceText'
import { getSupportSkill, getSkill } from '../store/skill'
import { log } from '../utils/index'
import tagText from '../utils/tagText'

let skillDataPrms = null
const ensureSkillData = async () => {
  if (!skillDataPrms) {
    skillDataPrms = getSkill()
  }
  return await skillDataPrms
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
    let text = arr.join('/')
    if (text !== item[key]) {
      item[key] = tagText(text)
    } else {
      // log(text)
    }
  }
}

const supportSkill = async (data) => {
  let obj = data
  if (data.gameData) return
  if (data.userSupportIdol) obj = data.userSupportIdol
  let sskill
  const asskill = obj.acquiredSupportSkills
  if (obj.supportSkills) {
    sskill = obj.supportSkills
  } else if (obj.supportIdol && obj.supportIdol.supportSkills) {
    sskill = obj.supportIdol.supportSkills
  }
  const skillData = await getSupportSkill()
  sskill && sskill.forEach(item => {
    transSkill(item, 'description', skillData)
    transSkill(item, 'name', skillData)
  })
  asskill && asskill.forEach(item => {
    transSkill(item, 'description', skillData)
    transSkill(item, 'name', skillData)
  })
}

const transEffects = (data, skillData) => {
  data.skillEffects && data.skillEffects.forEach(item => {
    transSkill(item, 'effectName', skillData)
    transSkill(item, 'effectDescription', skillData)
  })
  data.rivalMemoryAppealEffects && data.rivalMemoryAppealEffects.forEach(item => {
    transSkill(item, 'effectName', skillData)
    transSkill(item, 'effectDescription', skillData)
  })
}

const commSkill = (data, skillData, transEffect = false) => {
  if (!data) return
  transSkill(data, 'comment', skillData)
  transSkill(data, 'name', skillData)
  if (transEffect) {
    transEffects(data, skillData)
  }
  if (data.linkSkill) {
    transSkill(data.linkSkill, 'comment', skillData)
    transSkill(data.linkSkill, 'name', skillData)
    if (transEffect) {
      transEffects(data.linkSkill, skillData)
    }
  }
}

const exSkill = (data, skillData) => {
  transSkill(data, 'name', skillData)
  transSkill(data, 'description', skillData)
}

const skillPanel = (data, skillData) => {
  if (!data) return
  data.forEach(item => {
    transSkill(item, 'releaseConditions', skillData)
    transSkill(item.passiveSkills, 'comment', skillData)
    transSkill(item.passiveSkills, 'name', skillData)
    commSkill(item.skill, skillData)
    commSkill(item.concertActiveSkill, skillData)
    if (item.activeSkills) {
      item.activeSkills.forEach(skill => {
        commSkill(skill, skillData)
      })
    }
  })
}

const memoryAppeal = (data, skillData) => {
  data.forEach(item => {
    commSkill(item, skillData)
  })
}

const shortProIdol = (data, skillData, panel = false) => {
  let proIdol = data.userProduceIdol
  if (!proIdol) return
  proIdol.activeSkills && proIdol.activeSkills.forEach(item => {
    commSkill(item, skillData)
  })
  proIdol.passiveSkills && proIdol.passiveSkills.forEach(item => {
    commSkill(item, skillData)
  })
  proIdol.limitBreaks && proIdol.limitBreaks.forEach(item => {
    commSkill(item, skillData)
  })
  if (panel) {
    skillPanel(proIdol.skillPanels, skillData)
  }
}

const judegsSkill = (data, skillData) => {
  data.forEach(judge => {
    commSkill(judge.skill, skillData, true)
  })
}

const fesRivalsSkill = (data, skillData) => {
  if (!data) return
  data.forEach(rival => {
    rival.userFesDeck && rival.userFesDeck.userFesDeckMembers.forEach(member => {
      member.userFesIdol.activeSkills.forEach(skill => {
        transEffects(skill, skillData)
      })
    })
    rival.userRaidDeck && rival.userRaidDeck.userRaidDeckMembers.forEach(member => {
      member.userFesIdol.activeSkills.forEach(skill => {
        commSkill(skill, skillData, true)
      })
    })
    rival.rival && rival.rival.rivalSkills.forEach(skill => {
      transEffects(skill, skillData)
    })
  })
}

const audRivalsSkill = (data, skillData) => {
  data.forEach(rival => {
    transEffects(rival.rivalMemoryAppeal, skillData)
    rival.rivalSkills.forEach(skill => {
      transEffects(skill, skillData)
    })
  })
}

// ==================================================
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
    commSkill(item, skillData)
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
    commSkill(item, skillData)
  })
  commSkill(fesIdol.memoryAppeal, skillData)
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
      member.userFesIdol && member.userFesIdol.activeSkills.forEach(item => {
        commSkill(item, skillData)
      })
    })
  })
}

const userRaidDeck = async (data) => {
  const skillData = await ensureSkillData()
  data.userRaidDecks.forEach(deck => {
    deck.userRaidDeckMembers.forEach(member => {
      member.userFesIdol && member.userFesIdol.activeSkills.forEach(item => {
        commSkill(item, skillData)
      })
    })
  })
}

const proSkillPanels = async (data) => {
  const skillData = await ensureSkillData()
  data.userProduceSupportIdols.forEach(item => {
    skillPanel(item.skillPanels, skillData)
  })
  shortProIdol(data, skillData, true)
  data.userProduceLimitedSkills && data.userProduceLimitedSkills.forEach(item => {
    commSkill(item.passiveSkills, skillData)
    commSkill(item.skill, skillData)
  })
  try {
    skillPanel(data.userProduceIdol.userIdol.idol.skillPanels, skillData)
  } catch (e) {}
}

const produceFinish = async (data) => {
  if (data.gameData) return
  const skillData = await ensureSkillData()
  shortProIdol(data, skillData)
}

const fesMatchConcertSkill = async (data) => {
  const skillData = await ensureSkillData()
  const transDeckMember = (member) => {
    member.userFesIdol.activeSkills.forEach(item => {
      commSkill(item, skillData, true)
    })
    commSkill(member.userFesIdol.memoryAppeal, skillData, true)
    member.userFesIdol.passiveSkills.forEach(item => {
      transSkill(item, 'comment', skillData)
      transSkill(item, 'name', skillData)
      transEffects(item, skillData)
    })
  }
  data.userFesDeck && data.userFesDeck.userFesDeckMembers.forEach(transDeckMember)
  data.userRaidDeck && data.userRaidDeck.userRaidDeckMembers.forEach(transDeckMember)
  judegsSkill(data.judges, skillData)
  fesRivalsSkill(data.userFesRivals, skillData)
  fesRivalsSkill(data.userFesRaidRivals, skillData)
}

const auditionSkill = async (data) => {
  const skillData = await ensureSkillData()
  data.userProduceSupportIdols.forEach(item => {
    commSkill(item.activeSkill, skillData, true)
  })
  let proIdol = data.userProduceIdol
  proIdol.activeSkills.forEach(skill => {
    commSkill(skill, skillData, true)
  })
  commSkill(proIdol.memoryAppeal, skillData, true)
  proIdol.passiveSkills.forEach(skill => {
    commSkill(skill, skillData, true)
  })
  let audition = data.produceAudition || data.produceConcert
  judegsSkill(audition.judges, skillData)
  audRivalsSkill(audition.rivals, skillData)
}

const resumeGameSkill = async (data) => {
  if (!data.gameData) return
  try {
    let gData = JSON.parse(data.gameData)
    if (gData.produceAudition || gData.produceConcert) {
      await auditionSkill(gData)
    } else if (gData.userFesDeck || gData.userRaidDeck) {
      await fesMatchConcertSkill(gData)
    }
    data.gameData = JSON.stringify(gData)
  } catch (e) {
    log(e)
  }
}

const resumeRaidGameSkill = async (data) => {
  if (!data.gameState || !data.gameState.game_data) return
  try {
    let gData = JSON.parse(data.gameState.game_data)
    if (gData.userRaidDeck) {
      await fesMatchConcertSkill(gData)
    }
    data.gameState.game_data = JSON.stringify(gData)
  } catch (e) {
    log(e)
  }
}

const produceResultSkill = async (data) => {
  const skillData = await ensureSkillData()
  data.produceExSkillRewards.forEach(reward => {
    exSkill(reward.produceExSkill, skillData)
  })
}

const ideaNotesSkill = async (data) => {
  if (!data.userProduceIdeaNotes) return
  const skillData = await ensureSkillData()
  data.userProduceIdeaNotes.forEach(note => {
    let bonus = note.produceIdeaNote.produceIdeaNoteCompleteBonus
    transSkill(bonus, 'title', skillData)
    transSkill(bonus, 'comment', skillData)
    note.produceIdeaNote.produceIdeaNoteExtraBonuses.forEach(item => {
      transSkill(item, 'comment', skillData)
      transSkill(item, 'condition', skillData)
    })
  })
}

const noteResultSkill = async (data) => {
  const skillData = await ensureSkillData()
  try {
    let item = data.lessonResult.userProduceIdeaNote.produceIdeaNote.produceIdeaNoteCompleteBonus
    commSkill(item, skillData)
  } catch (e) {}
}

export {
  supportSkill, userIdolsSkill, produceExSkillTop,
  userFesIdolsSkill, userSptIdolsSkill, reserveUserIdolsSkill,
  reserveUserSptIdolsSkill, otherFesIdolSkill, userFesDeck, userRaidDeck, userProIdolsSkill,
  userProSptIdolsSkill, proSkillPanels, produceFinish,
  fesMatchConcertSkill, resumeGameSkill, resumeRaidGameSkill, auditionSkill, produceResultSkill,
  ideaNotesSkill, noteResultSkill
}
