import getName from '../store/name'
import tagText from '../utils/tagText'

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

export { produceIdolName }