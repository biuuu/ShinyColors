import getName from '../store/name'
import tagText from '../utils/tagText'
import { ensureTitle, saveTitle, transTitle } from './album/title'

const produceIdolName = async (data) => {
  const nameMap = await getName()
  if (data.userProduceIdol) {
    const char = data.userProduceIdol.userIdol.idol.character
    if (nameMap.has(char.name)) {
      char.name = nameMap.get(char.name)
    }
    if (nameMap.has(char.firstName)) {
      char.firstName = tagText(nameMap.get(char.firstName))
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

export { produceIdolName, produceEventTitle }