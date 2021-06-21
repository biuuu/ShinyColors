import { replaceItem } from '../utils/replaceText'
import { getSupportSkill, getSkill } from '../store/skill'
import { log } from '../utils/index'
import tagText from '../utils/tagText'
import { router } from './request'

let skillDataPrms = null
let skillData = null
const ensureSkillData = async () => {
  if (!skillDataPrms) {
    skillDataPrms = getSkill()
  }
  if (!skillData) {
    skillData = await skillDataPrms
  }
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
      if (rgs?.[1]) {
        arr.push(rgs[1])
        list[index] = str.replace(/[＋+]+$/, '')
      } else {
        arr.push('')
      }
    })
    return arr
  }
}

const transSkill = (item, key, data = skillData) => {
  if (item?.[key]) {
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

const transSupportSkill = (list, sData) => {
  list?.forEach(item => {
    transSkill(item, 'description', sData)
    transSkill(item, 'name', sData)
  })
}

const supportSkill = async (data) => {
  const sData = await getSupportSkill()
  const supportIdol = data.userSupportIdol ?? data
  transSupportSkill(supportIdol.acquiredSupportSkills, sData)
  transSupportSkill(supportIdol.supportSkills, sData)
  transSupportSkill(supportIdol.supportIdol?.supportSkills, sData)
}

const transEffects = (data) => {
  data.skillEffects?.forEach(item => {
    transSkill(item, 'effectName')
    transSkill(item, 'effectDescription')
  })
  data.rivalMemoryAppealEffects?.forEach(item => {
    transSkill(item, 'effectName')
    transSkill(item, 'effectDescription')
  })
}

const commSkill = (data, transEffect = false) => {
  if (!data) return
  transSkill(data, 'comment')
  transSkill(data, 'name')
  if (transEffect) {
    transEffects(data)
  }
  if (data.linkSkill) {
    transSkill(data.linkSkill, 'comment')
    transSkill(data.linkSkill, 'name')
    if (transEffect) {
      transEffects(data.linkSkill)
    }
  }
}

const exSkill = (data) => {
  transSkill(data, 'name')
  transSkill(data, 'description')
}

const skillPanel = (data) => {
  if (!data) return
  data.forEach(item => {
    transSkill(item, 'releaseConditions')
    transSkill(item.passiveSkills, 'comment')
    transSkill(item.passiveSkills, 'name')
    commSkill(item.skill)
    commSkill(item.concertActiveSkill)
    if (item.activeSkills) {
      item.activeSkills.forEach(skill => {
        commSkill(skill)
      })
    }
  })
}

const memoryAppeal = (data) => {
  data.forEach(item => {
    commSkill(item)
  })
}

const shortProIdol = (data, panel = false) => {
  let proIdol = data.userProduceIdol
  if (!proIdol) return
  proIdol.activeSkills?.forEach(item => {
    commSkill(item)
  })
  proIdol.abilities?.forEach(item => {
    commSkill(item)
  })
  proIdol.passiveSkills?.forEach(item => {
    commSkill(item)
  })
  proIdol.limitBreaks?.forEach(item => {
    commSkill(item)
  })
  if (panel) {
    skillPanel(proIdol.skillPanels)
  }
}

const judegsSkill = (data) => {
  data.forEach(judge => {
    commSkill(judge.skill, true)
  })
}

const fesRivalsSkill = (data) => {
  if (!data) return
  data.forEach(rival => {
    rival.userFesDeck?.userFesDeckMembers.forEach(member => {
      member.userFesIdol.activeSkills.forEach(skill => {
        transEffects(skill)
      })
    })
    rival.userRaidDeck?.userRaidDeckMembers.forEach(member => {
      member.userFesIdol.activeSkills.forEach(skill => {
        commSkill(skill, true)
      })
    })
    rival.rival?.rivalSkills.forEach(skill => {
      transEffects(skill)
    })
  })
}

const audRivalsSkill = (data) => {
  data.forEach(rival => {
    transEffects(rival.rivalMemoryAppeal)
    rival.rivalSkills.forEach(skill => {
      transEffects(skill)
    })
  })
}

// ==================================================
// request entry
const userIdolsSkill = async (data) => {
  await ensureSkillData()
  skillPanel(data.idol.skillPanels)
  memoryAppeal(data.idol.memoryAppeals)
  data.userIdolProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill)
  })
}

const userProIdolsSkill = async (data) => {
  await ensureSkillData()
  data.activeSkills.forEach(item => {
    commSkill(item)
  })
  memoryAppeal(data.userIdol.idol.memoryAppeals)
  data.userProduceIdolProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill)
  })
}

const reserveUserIdolsSkill = async (data) => {
  await ensureSkillData()
  skillPanel(data.idol.skillPanels)
  memoryAppeal(data.idol.memoryAppeals)
}

const userSptIdolsSkill = async (data) => {
  await ensureSkillData()
  skillPanel(data.supportIdol.skillPanels)
  data.userSupportIdolProduceExSkills?.forEach(item => {
    exSkill(item.produceExSkill)
  })
  data.supportIdol?.supportIdolActiveSkill?.activeSkills?.forEach(item => {
    transSkill(item, 'comment')
    transSkill(item, 'name')
  })
}

const userProSptIdolsSkill = async (data) => {
  await ensureSkillData()
  skillPanel(data.skillPanels)
  data.userProduceSupportIdolProduceExSkills?.forEach(item => {
    exSkill(item.produceExSkill)
  })
  data.userSupportIdol?.supportIdol?.supportIdolActiveSkill?.activeSkills?.forEach(item => {
    transSkill(item, 'comment')
    transSkill(item, 'name')
  })
}

const reserveUserSptIdolsSkill = async (data) => {
  await ensureSkillData()
  skillPanel(data.supportIdol.skillPanels)
  data.supportIdol?.supportIdolActiveSkill?.activeSkills?.forEach(item => {
    transSkill(item, 'comment')
    transSkill(item, 'name')
  })
}

const userFesIdolsSkill = async (data) => {
  await ensureSkillData()
  const fesIdol = data.userFesIdol
  fesIdol.activeSkills.forEach(item => {
    commSkill(item)
  })
  fesIdol.abilities.forEach(item => {
    commSkill(item)
  })
  commSkill(fesIdol.memoryAppeal)
  fesIdol.passiveSkills.forEach(item => {
    transSkill(item, 'comment')
    transSkill(item, 'name')
  })
  fesIdol.userFesIdolProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill)
  })
  fesIdol.userFesSupportIdols.forEach(sptIdol => {
    sptIdol.userFesSupportIdolProduceExSkills.forEach(item => {
      exSkill(item.produceExSkill)
    })
  })
}

const otherFesIdolSkill = userFesIdolsSkill

const produceExSkillTop = async (data) => {
  await ensureSkillData()
  data.userProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill)
  })
}

const userFesDeck = async (data) => {
  await ensureSkillData()
  data.userFesDecks.forEach(deck => {
    deck.userFesDeckMembers.forEach(member => {
      member.userFesIdol?.activeSkills.forEach(item => {
        commSkill(item)
      })
    })
  })
}

const userRaidDeck = async (data) => {
  await ensureSkillData()
  data.userRaidDecks.forEach(deck => {
    deck.userRaidDeckMembers.forEach(member => {
      member.userFesIdol?.activeSkills.forEach(item => {
        commSkill(item)
      })
    })
  })
}

const proSkillPanels = async (data) => {
  await ensureSkillData()
  data.userProduceSupportIdols.forEach(item => {
    skillPanel(item.skillPanels)
  })
  shortProIdol(data, true)
  data.userProduceLimitedSkills?.forEach(item => {
    commSkill(item.passiveSkills)
    commSkill(item.skill)
  })
  skillPanel(data.userProduceIdol?.userIdol?.idol?.skillPanels)
}

const produceFinish = async (data) => {
  if (data.gameData) return
  await ensureSkillData()
  shortProIdol(data)
}

const fesMatchConcertSkill = async (data) => {
  await ensureSkillData()
  const transDeckMember = (member) => {
    member.userFesIdol.activeSkills.forEach(item => {
      commSkill(item, true)
    })
    member.userFesIdol.abilities.forEach(item => {
      commSkill(item)
    })
    member.userFesIdol.concertAbilities.forEach(item => {
      commSkill(item)
    })
    commSkill(member.userFesIdol.memoryAppeal, true)
    member.userFesIdol.passiveSkills.forEach(item => {
      transSkill(item, 'comment')
      transSkill(item, 'name')
      transEffects(item)
    })
  }
  data.userFesDeck?.userFesDeckMembers.forEach(transDeckMember)
  data.userRaidDeck?.userRaidDeckMembers.forEach(transDeckMember)
  judegsSkill(data.judges)
  fesRivalsSkill(data.userFesRivals)
  fesRivalsSkill(data.userFesRaidRivals)
}

const auditionSkill = async (data) => {
  await ensureSkillData()
  data.fanActiveSkills?.forEach(item => {
    commSkill(item, true)
  })
  data.userProduceSupportIdols.forEach(item => {
    commSkill(item.activeSkill, true)
  })
  let proIdol = data.userProduceIdol
  proIdol.activeSkills.forEach(skill => {
    commSkill(skill, true)
  })
  proIdol.abilities?.forEach(skill => {
    commSkill(skill, true)
  })
  proIdol.concertAbilities?.forEach(skill => {
    commSkill(skill, true)
  })
  commSkill(proIdol.memoryAppeal, true)
  proIdol.passiveSkills.forEach(skill => {
    commSkill(skill, true)
  })
  let audition = data.produceAudition || data.produceConcert
  judegsSkill(audition.judges)
  audRivalsSkill(audition.rivals)
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
  await ensureSkillData()
  data.produceExSkillRewards.forEach(reward => {
    exSkill(reward.produceExSkill)
  })
}

const ideaNotesSkill = async (data) => {
  if (!data.userProduceIdeaNotes) return
  await ensureSkillData()
  data.userProduceIdeaNotes.forEach(note => {
    let bonus = note.produceIdeaNote.produceIdeaNoteCompleteBonus
    transSkill(bonus, 'title')
    transSkill(bonus, 'comment')
    note.produceIdeaNote.produceIdeaNoteExtraBonuses.forEach(item => {
      transSkill(item, 'comment')
      transSkill(item, 'condition')
    })
  })
}

const noteResultSkill = async (data) => {
  await ensureSkillData()
  let item = data.lessonResult?.userProduceIdeaNote?.produceIdeaNote?.produceIdeaNoteCompleteBonus
  commSkill(item)
}

const producesDecksSkill = async (data) => {
  const sData = await getSupportSkill()
  data.userSupportIdols?.forEach(item => {
    transSupportSkill(item.supportIdol?.supportSkills, sData)
  })
}

const producesActionReadySkill = async (data) => {
  const sData = await getSupportSkill()
  data.userDecks.forEach(deck => {
    deck.userSupportIdols.forEach(item => {
      transSupportSkill(item.supportIdol?.supportSkills, sData)
    })
  })
}

const produceAbilitiySkill = async (data) => {
  await ensureSkillData()
  data.userProduceIdol.activeSkills.forEach(item => {
    commSkill(item)
  })
  data.userProduceIdol.abilities.forEach(item => {
    commSkill(item)
  })
  data.userProduceAbilities.forEach(item => {
    commSkill(item.ability)
    transSkill(item.ability, 'acquireComment')
    item.ability.produceAbilityAcquireConditionComments.forEach(comm => {
      transSkill(comm, 'name')
    })
  })
}

const finishAbility = async (data) => {
  await ensureSkillData()
  data.concertEvent?.abilities?.forEach(item => {
    transSkill(item, 'name')
  })
}

const produceAreaAbilitySkill = async (data) => {
  await ensureSkillData()
  data.abilities?.forEach(item => {
    transSkill(item, 'acquireComment')
    transSkill(item, 'name')
    transSkill(item, 'comment')
  })
  data.produceMusics?.forEach(item => {
    commSkill(item.feverActiveSkill)
    item.produceMusicProficiencyBonuses.forEach(m => {
      transSkill(item, 'description')
      if (!m.ability) return
      commSkill(m.ability)
      transSkill(m.ability, 'acquireComment')
      m.ability.produceAbilityAcquireConditionComments.forEach(comm => {
        transSkill(comm, 'name')
      })
    })
  })
}

const userProduceMusicProficiency = async (data) => {
  await produceAreaAbilitySkill(data.userProduceMusicProficiency)
}

const userProduceMusicProficiencies = async (data) => {
  for (let item of data.userProduceMusicProficiencies) {
    await produceAreaAbilitySkill(item)
  }
}

router.get([
  [['userSupportIdols/{num}', 'userSupportIdols/statusMax', 'produceTeachingSupportIdols/{num}'], [supportSkill, userSptIdolsSkill]],
  ['userProduce(Teaching)?SupportIdols/{num}', [supportSkill, userProSptIdolsSkill]],
  ['userReserveSupportIdols/userSupportIdol/{num}', [supportSkill, reserveUserSptIdolsSkill]],
  ['userIdols/{num}/produceExSkillTop', produceExSkillTop],
  ['userSupportIdols/{num}/produceExSkillTop', produceExSkillTop],
  [['userIdols/{num}', 'userIdols/statusMax', 'produceTeachingIdols/{num}'], [userIdolsSkill]],
  [['userProduce(Teaching)?Idols/{num}', 'userProduceTeachingIdol'], userProIdolsSkill],
  ['userReserveIdols/userIdol/{num}', reserveUserIdolsSkill],
  ['userFesIdols/{num}', userFesIdolsSkill],
  [['userProduces/skillPanels', 'userProduceTeachings/skillPanels'], proSkillPanels],
  ['fes(Match)?Concert/actions/resume', [resumeGameSkill]],
  ['earthUsers/{uuid}/userFesIdols/{num}', otherFesIdolSkill],
  ['userRaidDecks', userRaidDeck],
  ['produces/{num}/decks', producesDecksSkill],
  ['userProduceAbilities', produceAbilitiySkill],
  [['userProduceAreas', 'produceMusics'], produceAreaAbilitySkill],
  ['userProduces', userProduceMusicProficiencies]
])

router.post([
  ['userIdols/{num}/produceExSkills/{num}/actions/set', userIdolsSkill],
  ['produces/{num}/actions/ready', [producesActionReadySkill]],
  [['userProduce(Teaching)?s/skillPanels/{num}', 'userProduces/limitedSkills/{num}'], proSkillPanels],
  ['userSupportIdols/{num}/produceExSkills/{num}/actions/set', [ userSptIdolsSkill, supportSkill]],
  ['produces/actions/(resume|next)', [ideaNotesSkill, supportSkill]],
  [['produces/actions/resume', 'produces/actions/finish', 'produceTeachings/resume'], [produceFinish, resumeGameSkill]],
  [['produces/actions/resume', 'produces/actions/next'], userProduceMusicProficiencies],
  ['produces/actions/act', [noteResultSkill]],
  ['fes(Match|Raid)?Concert/actions/start', [fesMatchConcertSkill]],
  ['fes(Match)?Concert/actions/resume', [resumeGameSkill]],
  ['fesRaidConcert/actions/resume', [resumeRaidGameSkill]],
  ['produces/actions/result', [produceResultSkill]],
  [['produce(Teaching)?s/({num}/audition|concert)/actions/start', 'produceTeachings/(auditions|concerts)/start'], [auditionSkill]],
  ['produces/({num}/audition|concert)/actions/(start|finish)', finishAbility],
  [['produceTeachings/resume', 'produceTeachings/next'], supportSkill],
  ['userProduceAbilities', produceAbilitiySkill],
  ['userProduceMusicProficiencies', userProduceMusicProficiency]
])

router.patch('userSupportIdols/{num}', supportSkill)
