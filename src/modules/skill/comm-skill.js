import transApi from '../api-comm'

const { api, transItem } = transApi('skill')

const transEffects = (data) => {
  data.skillEffects?.forEach(item => {
    transItem(item, 'effectName')
    transItem(item, 'effectDescription')
  })
  data.rivalMemoryAppealEffects?.forEach(item => {
    transItem(item, 'effectName')
    transItem(item, 'effectDescription')
  })
}

const commSkill = (data, transEffect = false) => {
  if (!data) return
  transItem(data, 'comment')
  transItem(data, 'name')
  if (transEffect) {
    transEffects(data)
  }
  if (data.linkSkill) {
    transItem(data.linkSkill, 'comment')
    transItem(data.linkSkill, 'name')
    if (transEffect) {
      transEffects(data.linkSkill)
    }
  }
}

const skillPanel = (data) => {
  if (!data) return
  data.forEach(item => {
    transItem(item, 'releaseConditions')
    transItem(item.passiveSkills, 'comment')
    transItem(item.passiveSkills, 'name')
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
const userIdolsSkill = (data) => {
  skillPanel(data.idol.skillPanels)
  memoryAppeal(data.idol.memoryAppeals)
}

const userProIdolsSkill = (data) => {
  data.activeSkills.forEach(item => {
    commSkill(item)
  })
  memoryAppeal(data.userIdol.idol.memoryAppeals)
}

const reserveUserIdolsSkill = (data) => {
  skillPanel(data.idol.skillPanels)
  memoryAppeal(data.idol.memoryAppeals)
}

const userSptIdolsSkill = (data) => {
  skillPanel(data.supportIdol.skillPanels)
  data.supportIdol?.supportIdolActiveSkill?.activeSkills?.forEach(item => {
    transItem(item, 'comment')
    transItem(item, 'name')
  })
}

const userProSptIdolsSkill = (data) => {
  skillPanel(data.skillPanels)
  data.userSupportIdol?.supportIdol?.supportIdolActiveSkill?.activeSkills?.forEach(item => {
    transItem(item, 'comment')
    transItem(item, 'name')
  })
}

const reserveUserSptIdolsSkill = (data) => {
  skillPanel(data.supportIdol.skillPanels)
  data.supportIdol?.supportIdolActiveSkill?.activeSkills?.forEach(item => {
    transItem(item, 'comment')
    transItem(item, 'name')
  })
}

const userFesIdolsSkill = (data) => {
  const fesIdol = data.userFesIdol
  fesIdol.activeSkills.forEach(item => {
    commSkill(item)
  })
  commSkill(fesIdol.memoryAppeal)
  fesIdol.passiveSkills.forEach(item => {
    transItem(item, 'comment')
    transItem(item, 'name')
  })
}

const otherFesIdolSkill = userFesIdolsSkill

const userRaidDeck = (data) => {
  data.userRaidDecks.forEach(deck => {
    deck.userRaidDeckMembers.forEach(member => {
      member.userFesIdol?.activeSkills.forEach(item => {
        commSkill(item)
      })
    })
  })
}

const proSkillPanels = (data) => {
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

const produceFinish = (data) => {
  if (data.gameData) return
  shortProIdol(data)
}

const fesMatchConcertSkill = (data) => {
  const transDeckMember = (member) => {
    member.userFesIdol.activeSkills.forEach(item => {
      commSkill(item, true)
    })
    commSkill(member.userFesIdol.memoryAppeal, true)
    member.userFesIdol.passiveSkills.forEach(item => {
      transItem(item, 'comment')
      transItem(item, 'name')
      transEffects(item)
    })
  }
  data.userFesDeck?.userFesDeckMembers.forEach(transDeckMember)
  data.userRaidDeck?.userRaidDeckMembers.forEach(transDeckMember)
  judegsSkill(data.judges)
  fesRivalsSkill(data.userFesRivals)
  fesRivalsSkill(data.userFesRaidRivals)
}

const auditionSkill = (data) => {
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
  commSkill(proIdol.memoryAppeal, true)
  proIdol.passiveSkills.forEach(skill => {
    commSkill(skill, true)
  })
  let audition = data.produceAudition || data.produceConcert
  judegsSkill(audition.judges)
  audRivalsSkill(audition.rivals)
}

const resumeGameSkill = (data) => {
  if (!data.gameData) return
  try {
    let gData = JSON.parse(data.gameData)
    if (gData.produceAudition || gData.produceConcert) {
      auditionSkill(gData)
    } else if (gData.userFesDeck || gData.userRaidDeck) {
      fesMatchConcertSkill(gData)
    }
    data.gameData = JSON.stringify(gData)
  } catch (e) {
    log(e)
  }
}

const resumeRaidGameSkill = (data) => {
  if (!data.gameState || !data.gameState.game_data) return
  try {
    let gData = JSON.parse(data.gameState.game_data)
    if (gData.userRaidDeck) {
      fesMatchConcertSkill(gData)
    }
    data.gameState.game_data = JSON.stringify(gData)
  } catch (e) {
    log(e)
  }
}

const produceAbilitiySkill = (data) => {
  data.userProduceIdol.activeSkills.forEach(item => {
    commSkill(item)
  })
}

const produceAreaAbilitySkill = (data) => {
  data.produceMusics?.forEach(item => {
    commSkill(item.feverActiveSkill)
    item.produceMusicProficiencyBonuses.forEach(m => {
      transItem(item, 'description')
      if (!m.ability) return
      commSkill(m.ability)
      transItem(m.ability, 'acquireComment')
      m.ability.produceAbilityAcquireConditionComments.forEach(comm => {
        transItem(comm, 'name')
      })
    })
  })
}

const userProduceMusicProficiency = (data) => {
  produceAreaAbilitySkill(data.userProduceMusicProficiency)
}

const userProduceMusicProficiencies = (data) => {
  data.userProduceMusicProficiencies?.forEach(item => {
    produceAreaAbilitySkill(item)
  })
}

const userProduceReporterEvent = data => {
  data.userProduceReporterEvent?.produceReporterEventResult?.produceReporterEventSkills?.forEach(item => {
    transItem(item, 'name')
  })
}

api.get([
  [['userSupportIdols/{num}', 'userSupportIdols/statusMax', 'produceTeachingSupportIdols/{num}'], [userSptIdolsSkill]],
  ['userProduce(Teaching)?SupportIdols/{num}', [userProSptIdolsSkill]],
  ['userReserveSupportIdols/userSupportIdol/{num}', [reserveUserSptIdolsSkill]],
  [['userIdols/{num}', 'userIdols/statusMax', 'produceTeachingIdols/{num}'], [userIdolsSkill]],
  [['userProduce(Teaching)?Idols/{num}', 'userProduceTeachingIdol'], userProIdolsSkill],
  ['userReserveIdols/userIdol/{num}', reserveUserIdolsSkill],
  ['userFesIdols/{num}', userFesIdolsSkill],
  [['userProduces/skillPanels', 'userProduceTeachings/skillPanels'], proSkillPanels],
  ['fes(Match)?Concert/actions/resume', [resumeGameSkill]],
  ['earthUsers/{uuid}/userFesIdols/{num}', otherFesIdolSkill],
  ['userRaidDecks', userRaidDeck],
  ['userProduceAbilities', produceAbilitiySkill],
  [['userProduceAreas', 'produceMusics'], produceAreaAbilitySkill],
  ['userProduces', [userProduceMusicProficiencies, userProduceReporterEvent]]
])

api.post([
  ['userIdols/{num}/produceExSkills/{num}/actions/set', userIdolsSkill],
  [['userProduce(Teaching)?s/skillPanels/{num}', 'userProduces/limitedSkills/{num}'], proSkillPanels],
  ['userSupportIdols/{num}/produceExSkills/{num}/actions/set', [userSptIdolsSkill]],
  [['produces/actions/resume', 'produces/actions/finish', 'produceTeachings/resume'], [produceFinish, resumeGameSkill]],
  [['produces/actions/resume', 'produces/actions/next'], [userProduceMusicProficiencies, userProduceReporterEvent]],
  ['fes(Match|Raid)?Concert/actions/start', [fesMatchConcertSkill]],
  ['fes(Match)?Concert/actions/resume', [resumeGameSkill]],
  ['fesRaidConcert/actions/resume', [resumeRaidGameSkill]],
  [['produce(Teaching)?s/({num}/audition|concert)/actions/start', 'produceTeachings/(auditions|concerts)/start'], [auditionSkill]],
  ['userProduceAbilities', produceAbilitiySkill],
  ['userProduceMusicProficiencies', userProduceMusicProficiency]
])
