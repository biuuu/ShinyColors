import transApi from '../api-comm'
import { ensureIdolFilter, someSupportSkillName } from '../idol-filter'
import { transEffects } from './comm-skill'

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

const transFightSkill = (data) => {
  transItem(data, 'name')
  transItem(data, 'comment')
  if (data?.comment) {
    data.comment = data.comment.replace(/\((\d+),(\d+),(\d+)\)/, '($1/$2/$3)')
  }
}

const fightSkill = (data) => {
  const obj = data.userSupportIdol ?? data
  const fightSkill = obj?.supportIdol?.fightSkill
  if (!fightSkill) return
  transFightSkill(fightSkill)
  fightSkill.skills.forEach(obj => {
    transFightSkill(obj.skill)
    transEffects(obj.skill.skillEffects)
  })
}

api.get([
  [['userSupportIdols/{num}', 'userSupportIdols/statusMax', 'produceTeachingSupportIdols/{num}'], [supportSkill, fightSkill]],
  ['userProduce(Teaching)?SupportIdols/{num}', [supportSkill, fightSkill]],
  ['userReserveSupportIdols/userSupportIdol/{num}', [supportSkill, fightSkill]],
  ['produces/{num}/decks', producesDecksSkill]
])

api.post([
  ['produces/{num}/actions/ready', [producesActionReadySkill]],
  ['userSupportIdols/{num}/produceExSkills/{num}/actions/set', [supportSkill, fightSkill]],
  ['produces/actions/(resume|next)', [supportSkill, fightSkill]],
  [['produceTeachings/resume', 'produceTeachings/next'], supportSkill]
])

api.patch([
  ['userSupportIdols/{num}', supportSkill],
  ['produces/{num}/produceItem/consume', useProduceItem]
])