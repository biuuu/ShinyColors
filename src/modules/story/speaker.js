import { getModule } from '../get-module'
import getSpeakerIcon from '../../store/speakerIcon'
import getName from '../../store/name'
import { trim } from '../../utils/'
import tagText, { restoreText } from '../../utils/tagText'

let namePromise = null
const ensureName = async () => {
  if (!namePromise) {
    namePromise = getName()
  }
  return await namePromise
}

let isHooked = false
const hookSpeakerIcon = async () => {
  if (isHooked) return
  isHooked = true
  const speakerModule = await getModule('SPEAKER')
  const { iconMap, subIconMap } = await getSpeakerIcon()
  const originSubChar = speakerModule.getSubCharacterBackLogIconId
  const originCharBack = speakerModule.getCharacterBackLogIconId
  speakerModule.getSubCharacterBackLogIconId = function (name) {
    const _name = restoreText(name)
    if (subIconMap.has(_name)) {
      return subIconMap.get(_name)
    }
    return originSubChar.call(this, name)
  }
  speakerModule.getCharacterBackLogIconId = function (name) {
    const _name = restoreText(name)
    if (iconMap.has(_name)) {
      return iconMap.get(_name)
    }
    return originCharBack.call(this, name)
  }
}

const splitText = (text, sep, map) => {
  const arr = text.split(sep)
  for (let i = 0; i < arr.length; i++) {
    if (map.has(arr[i])) {
      arr[i] = map.get(arr[i])
    }
  }
  return arr.join(sep)
}

const transSpeaker = async (item) => {
  if (item.speaker) {
    await hookSpeakerIcon()
    const nameMap = await ensureName()
    let text = trim(item.speaker)
    const sepList = ['＆', '&']
    sepList.forEach(sep => {
      text = splitText(text, sep, nameMap)
    })
    item.speaker = tagText(text)
  }
}

export { hookSpeakerIcon }
export default transSpeaker