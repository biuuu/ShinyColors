import transApi from '../api-comm'

const { api, transItem } = transApi('etc/landing-point')

const commSkill = (data) => {
  if (!data) return
  transItem(data, 'comment')
  transItem(data, 'name')
  transItem(data, 'acquireComment')
  transItem(data, 'releaseComment')
}

const produceMusicAssignment = (item) => {
  transItem(item, 'title')
  item.produceMusicAssignmentClearBonuses.forEach(bonus => {
    transItem(bonus, 'title')
  })
}

const commMusic = (music) => {
  transItem(music.feverActiveSkill, 'comment')
  music.produceMusicProficiencyBonuses.forEach(item => {
    transItem(item, 'description')
    if (!item.ability) return
    commSkill(item.ability)
    item.ability.produceAbilityAcquireConditionComments?.forEach(comm => {
      transItem(comm, 'name')
    })
  })
  music.produceMusicAssignments?.forEach(produceMusicAssignment)
  music.produceMusicProficiencyJudgeStarBonuses?.forEach(item => {
    transItem(item, 'description')
  })
}

const produceAreaAbilitySkill = (data) => {
  data.produceMusics?.forEach(commMusic)
}

const userProduceMusicProficiency = (item) => {
  commMusic(item.produceMusic)
  item.userProduceMusicAssignments?.forEach(ma => {
    produceMusicAssignment(ma.produceMusicAssignment)
  })
  item.allUserProduceMusicAssignments?.forEach(ma => {
    produceMusicAssignment(ma.produceMusicAssignment)
  })
  item.judgeStarBonuses?.forEach(bonus => {
    transItem(bonus, 'description')
  })
}

const postProficiency = (data) => {
  userProduceMusicProficiency(data.userProduceMusicProficiency)
}

const userProduceMusicProficiencies = (data) => {
  data.userProduceMusicProficiencies?.forEach(userProduceMusicProficiency)
  data.activatedProduceMusicAssignmentBonuses?.forEach(bonus => {
    bonus.produceMusicAssignmentClearBonuses?.forEach(clearBonus => {
      transItem(clearBonus, 'title')
    })
  })
}

const patchAssignments = data => {
  produceMusicAssignment(data.produceMusicAssignment)
}

const commonAbility = item => {
  commSkill(item)
  item.skillEffects?.forEach(effect => {
    transItem(effect, 'effectDescription')
    transItem(effect, 'effectName')
  })
}

const concertStart = data => {
  data.produceMusic?.judgeStarBonuses?.forEach(item => {
    transItem(item, 'description')
  })
  data.userProduceIdol?.abilities?.forEach(commonAbility)
  transItem(data.feverActiveSkill, 'comment')
}

const fesIdol = data => {
  data.userFesIdol?.abilities?.forEach(commonAbility)
}

const resumeGameSkill = (data) => {
  if (!data.gameData) return
  try {
    let gData = JSON.parse(data.gameData)
    if (gData.produceAudition || gData.produceConcert) {
      concertStart(gData)
    } else if (gData.userFesDeck || gData.userRaidDeck) {

    }
    data.gameData = JSON.stringify(gData)
  } catch (e) {
    log(e)
  }
}

api.get([
  [['userProduceAreas', 'produceMusics'], produceAreaAbilitySkill],
  ['userProduces', [userProduceMusicProficiencies]],
  ['userFesIdols/{num}', fesIdol]
])

api.post([
  [['produces/actions/resume', 'produces/actions/next'], [userProduceMusicProficiencies]],
  ['produces/actions/resume', resumeGameSkill],
  ['userProduceMusicProficiencies', postProficiency],
  ['produces/concert/actions/start', concertStart]
])

api.patch([
  ['userProduceMusicAssignments/{num}', patchAssignments]
])