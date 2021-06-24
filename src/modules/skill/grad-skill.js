import transApi from '../api-comm'

const { api, transItem } = transApi('etc/grad-skill')

const commSkill = (data) => {
  if (!data) return
  transItem(data, 'comment')
  transItem(data, 'name')
  transItem(data, 'acquireComment')
  transItem(data, 'releaseComment')
  data.produceAbilityAcquireConditionComments?.forEach(comm => {
    transItem(comm, 'name')
  })
}

const shortProIdol = (data, panel = false) => {
  let proIdol = data.userProduceIdol
  if (!proIdol) return
  proIdol.abilities?.forEach(item => {
    commSkill(item)
  })
}

const userFesIdolsSkill = (data) => {
  const fesIdol = data.userFesIdol
  fesIdol.abilities.forEach(item => {
    commSkill(item)
  })
}

const otherFesIdolSkill = userFesIdolsSkill

const produceFinish = (data) => {
  if (data.gameData) return
  shortProIdol(data)
}

const fesMatchConcertSkill = (data) => {
  const transDeckMember = (member) => {
    member.userFesIdol.abilities.forEach(item => {
      commSkill(item)
    })
    member.userFesIdol.concertAbilities.forEach(item => {
      commSkill(item)
    })
  }
  data.userFesDeck?.userFesDeckMembers.forEach(transDeckMember)
  data.userRaidDeck?.userRaidDeckMembers.forEach(transDeckMember)
}

const auditionSkill = (data) => {
  const proIdol = data.userProduceIdol
  if (!proIdol) return
  proIdol.abilities?.forEach(skill => {
    commSkill(skill, true)
  })
  proIdol.concertAbilities?.forEach(skill => {
    commSkill(skill, true)
  })
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
  data.userProduceIdol.abilities.forEach(item => {
    commSkill(item)
  })
  data.userProduceAbilities.forEach(item => {
    commSkill(item.ability)
  })
}

const finishAbility = (data) => {
  data.concertEvent?.abilities?.forEach(item => {
    transItem(item, 'name')
  })
}

const produceAreaAbilitySkill = (data) => {
  data.abilities?.forEach(item => {
    commSkill(item)
  })
}

api.get([
  ['userFesIdols/{num}', userFesIdolsSkill],
  ['fes(Match)?Concert/actions/resume', [resumeGameSkill]],
  ['earthUsers/{uuid}/userFesIdols/{num}', otherFesIdolSkill],
  ['userProduceAbilities', produceAbilitiySkill],
  [['userProduceAreas'], produceAreaAbilitySkill]
])

api.post([
  [['produces/actions/resume', 'produces/actions/finish', 'produceTeachings/resume'], [produceFinish, resumeGameSkill]],
  ['fes(Match|Raid)?Concert/actions/start', [fesMatchConcertSkill]],
  ['fes(Match)?Concert/actions/resume', [resumeGameSkill]],
  ['fesRaidConcert/actions/resume', [resumeRaidGameSkill]],
  [['produce(Teaching)?s/({num}/audition|concert)/actions/start', 'produceTeachings/(auditions|concerts)/start'], [auditionSkill]],
  ['produces/({num}/audition|concert)/actions/(start|finish)', finishAbility],
  ['userProduceAbilities', produceAbilitiySkill]
])
