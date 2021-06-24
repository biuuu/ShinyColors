import transApi from '../api-comm'

const { api, transItem } = transApi('etc/landing-point')

const commSkill = (data) => {
  if (!data) return
  transItem(data, 'comment')
  transItem(data, 'name')
  transItem(data, 'acquireComment')
  transItem(data, 'releaseComment')
}

const produceMusicAssignment = (data) => {
  const item = data.produceMusicAssignment
  transItem(item, 'title')
  item.produceMusicAssignmentClearBonuses.forEach(bonus => {
    transItem(bonus, 'title')
  })
}

const produceAreaAbilitySkill = (data) => {
  data.produceMusics?.forEach(music => {
    commSkill(music.feverActiveSkill)
    music.produceMusicProficiencyBonuses.forEach(item => {
      transItem(item, 'description')
      if (!item.ability) return
      commSkill(item.ability)
      item.ability.produceAbilityAcquireConditionComments?.forEach(comm => {
        transItem(comm, 'name')
      })
    })
    music.produceMusicAssignments?.forEach(produceMusicAssignment)
  })
}

const userProduceMusicProficiency = (data) => {
  produceAreaAbilitySkill(data.userProduceMusicProficiency)
}

const userProduceMusicProficiencies = (data) => {
  data.userProduceMusicProficiencies?.forEach(item => {
    produceAreaAbilitySkill(item)
    item.produceMusicAssignments?.forEach(produceMusicAssignment)
    item.allUserProduceMusicAssignments?.forEach(produceMusicAssignment)
  })
}

api.get([
  [['userProduceAreas', 'produceMusics'], produceAreaAbilitySkill],
  ['userProduces', [userProduceMusicProficiencies]]
])

api.post([
  [['produces/actions/resume', 'produces/actions/next'], [userProduceMusicProficiencies]],
  ['userProduceMusicProficiencies', userProduceMusicProficiency]
])