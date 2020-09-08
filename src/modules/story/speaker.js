import { getModule } from '../get-module'
import getSpeakerIcon from '../../store/speakerIcon'
import getName from '../../store/name'
import { trim, log2 } from '../../utils/'
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
  if (!speakerModule) return log2('Speaker-icon module not found.')
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

const nameWithNum = (name, map) => {
  let text = name
  let num = ''
  if (/[0-9０-９]$/.test(name)) {
    num = name.match(/([0-9０-９])$/)[1]
    text = name.slice(0, name.length - 1)
  }
  return map.has(text) ? map.get(text) + num : name
}

const splitText = (text, sep, map) => {
  const arr = text.split(sep)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = nameWithNum(arr[i], map)
  }
  return arr.join(sep)
}

const transSpeaker = async (item) => {
  if (item.speaker) {
    await hookSpeakerIcon()
    const nameMap = await ensureName()
    let text = trim(item.speaker)
    if (nameMap.has(text)) {
      return item.speaker = tagText(nameMap.get(text))
    }
    const sepList = ['＆', '&']
    sepList.forEach(sep => {
      text = splitText(text, sep, nameMap)
    })
    item.speaker = tagText(text)
  }
}

export { hookSpeakerIcon }
export default transSpeaker