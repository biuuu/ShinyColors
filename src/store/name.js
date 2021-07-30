import { commonStore } from './index'

const getBaseName = commonStore({
  name: 'name',
  keys: {
    text: 'name'
  }
})

const getBaseIdolName = commonStore({
  name: 'etc/idol-name',
  keys: {
    text: 'name'
  }
})

const getIdolName = async (full = true) => {
  const map = await getBaseIdolName()
  const idolMap = new Map()
  for (let [text, trans] of map) {
    const textArr = text.split(' ')
    const transArr = trans.split(' ')
    if (full) {
      idolMap.set(textArr[1], transArr[1])
    }
    idolMap.set(textArr.join(''), transArr.join(''))
    idolMap.set(text, trans)
  }
  return idolMap
}

let nameMap = null
const getName = async () => {
  if (nameMap) return nameMap
  const baseMap = await getBaseName()
  const idolMap = await getIdolName()
  nameMap = new Map([...baseMap, ...idolMap])
  return nameMap
}

export default getName
export { getIdolName }