import getSpeakerIcon from '../../store/speakerIcon'
import getName from '../../store/name'
import { trim } from '../../utils/'

let namePromise = null
let iconMap = new Map()
const ensureName = async () => {
  if (!namePromise) {
    namePromise = getName()
    iconMap = (await getSpeakerIcon()).iconMap
  }
  return await namePromise
}

let idolFlag = false
let staffFlag = false
const checkSpeakerData = (data, type) => {
  if (idolFlag && staffFlag) {
    return false
  }
  if (type === 'idol' && data[0]?.['002']?.includes && data[0]?.['002']?.includes('灯織')) {
    idolFlag = true
    return data[0]?.['002']?.includes('灯織')
  } else if (data[0]?.[901]?.includes && data[0]?.[901]?.includes('はづき')) {
    staffFlag = true
    return data[0]?.[901]?.includes('はづき')
  }
}

const originObjKeys = Object.keys
Object.keys = new Proxy(originObjKeys, {
  apply (target, self, args) {
    if (checkSpeakerData(args, 'idol') || checkSpeakerData(args, 'staff')) {
      for (let [id, name] of iconMap) {
        let _name = name
        if (Array.isArray(args[0][id]) && !args[0][id].includes(_name)) {
          args[0][id].push(_name)
        }
      }
    }
    return Reflect.apply(target, self, args)
  }
})

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
    const nameMap = await ensureName()
    let text = trim(item.speaker)
    if (nameMap.has(text)) {
      return item.speaker = nameMap.get(text)
    }
    const sepList = ['＆', '&']
    sepList.forEach(sep => {
      text = splitText(text, sep, nameMap)
    })
    if (text !== item.speaker) {
      item.speaker = text
    }
  }
}

export default transSpeaker