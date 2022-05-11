import transApi from '../api-comm'
import { ensureIdolFilter, someSupportSkillName } from '../idol-filter'

const { api, transItem } = transApi('support-skill', ensureIdolFilter)

const transSupportSkill = (list) => {
  list?.forEach(item => {
    transItem(item, 'description')
    someSupportSkillName(item)
  })
}

const supportSkill = (data) => {
  const supportIdol = data.userSupportIdol ?? data
  transSupportSkill(supportIdol.acquiredSupportSkills)
  transSupportSkill(supportIdol.supportSkills)
  transSupportSkill(supportIdol.supportIdol?.supportSkills)
}

const producesDecksSkill = (data) => {
  data.userSupportIdols?.forEach(item => {
    transSupportSkill(item.supportIdol?.supportSkills)
  })
}

const producesActionReadySkill = (data) => {
  data.userDecks.forEach(deck => {
    deck.userSupportIdols.forEach(item => {
      transSupportSkill(item.supportIdol?.supportSkills)
    })
  })
}

const useProduceItem = data => {
  transSupportSkill(data.supportSkills)
}

api.get([
  [['userSupportIdols/{num}', 'userSupportIdols/statusMax', 'produceTeachingSupportIdols/{num}'], [supportSkill]],
  ['userProduce(Teaching)?SupportIdols/{num}', [supportSkill]],
  ['userReserveSupportIdols/userSupportIdol/{num}', [supportSkill]],
  ['produces/{num}/decks', producesDecksSkill]
])

api.post([
  ['produces/{num}/actions/ready', [producesActionReadySkill]],
  ['userSupportIdols/{num}/produceExSkills/{num}/actions/set', [supportSkill]],
  ['produces/actions/(resume|next)', [supportSkill]],
  [['produceTeachings/resume', 'produceTeachings/next'], supportSkill]
])

api.patch([
  ['userSupportIdols/{num}', supportSkill],
  ['produces/{num}/produceItem/consume', useProduceItem]
])