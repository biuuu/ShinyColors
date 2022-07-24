import getName from '../store/name'
import { ensureTitle, saveTitle, transTitle } from './album/title'
import { router } from './request'

const produceIdolName = async (data) => {
  const nameMap = await getName()
  if (data.userProduceIdol) {
    const char = data.userProduceIdol.userIdol.idol.character
    if (nameMap.has(char.name)) {
      char.name = nameMap.get(char.name)
    }
    if (nameMap.has(char.firstName)) {
      char.firstName = nameMap.get(char.firstName)
    }
  }
}

const produceEventTitle = async (data) => {
  await ensureTitle()
  data.produceEvents?.forEach(event => {
    transTitle(event, 'title')
    saveTitle(event.id, event.title)
  })
}

const homeProduceTitle = async (data) => {
  await ensureTitle()
  transTitle(data?.userProduce?.produce, 'title')
}

const produceAreaTitles = async (data) => {
  await ensureTitle()
  data.produceHintSettings?.forEach(item => {
    transTitle(item, 'title')
  })
}

router.get([
  ['userProduceAreas', produceAreaTitles]
])

router.post([
  ['myPage', homeProduceTitle],
  ['produces/actions/(resume|next)', [produceEventTitle, produceIdolName]],
  [['produces/actions/resume', 'produces/actions/finish', 'produceTeachings/resume'], produceEventTitle],
  ['produces/actions/act', produceEventTitle],
  ['produces/({num}/audition|concert)/actions/(start|finish)', produceIdolName]
])