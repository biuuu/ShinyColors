import transApi from '../api-comm'

const { api, transItem } = transApi('etc/ex-skill')

const exSkill = (data) => {
  transItem(data, 'name')
  transItem(data, 'description')
}

const userIdolsSkill = (data) => {
  data.userIdolProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill)
  })
}

const userProIdolsSkill = (data) => {
  data.userProduceIdolProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill)
  })
}

const userSptIdolsSkill = (data) => {
  data.userSupportIdolProduceExSkills?.forEach(item => {
    exSkill(item.produceExSkill)
  })
}

const userProSptIdolsSkill = (data) => {
  data.userProduceSupportIdolProduceExSkills?.forEach(item => {
    exSkill(item.produceExSkill)
  })
}

const userFesIdolsSkill = (data) => {
  const fesIdol = data.userFesIdol
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

const produceResultSkill = (data) => {
  data.produceExSkillRewards.forEach(reward => {
    exSkill(reward.produceExSkill)
  })
}

const produceExSkillTop = (data) => {
  data.userIdols?.forEach(idol => {
    idol.userIdolProduceExSkills?.forEach(item => {
      exSkill(item.produceExSkill)
    })
  })
  data.userSupportIdols?.forEach(idol => {
    idol.userSupportIdolProduceExSkills?.forEach(item => {
      exSkill(item.produceExSkill)
    })
  })
  data.userProduceExSkills.forEach(item => {
    exSkill(item.produceExSkill)
    exSkill(item.produceExSkillUpgrade?.produceExSkill)
  })
}

api.get([
  [['userIdols/produceExSkillTop', 'userSupportIdols/produceExSkillTop', 'userIdols/{num}/produceExSkillTop', 'userSupportIdols/{num}/produceExSkillTop'], produceExSkillTop],
  [['userSupportIdols/{num}', 'userSupportIdols/statusMax', 'produceTeachingSupportIdols/{num}'], [userSptIdolsSkill]],
  ['userProduce(Teaching)?SupportIdols/{num}', [userProSptIdolsSkill]],
  [['userIdols/{num}', 'userIdols/statusMax', 'produceTeachingIdols/{num}'], [userIdolsSkill]],
  [['userProduce(Teaching)?Idols/{num}', 'userProduceTeachingIdol'], userProIdolsSkill],
  ['userFesIdols/{num}', userFesIdolsSkill],
  ['earthUsers/{uuid}/userFesIdols/{num}', otherFesIdolSkill]
])

api.post([
  ['userIdols/{num}/produceExSkills/{num}/actions/set', userIdolsSkill],
  ['userSupportIdols/{num}/produceExSkills/{num}/actions/set', [ userSptIdolsSkill]],
  ['produces/actions/result', [produceResultSkill]]
])
