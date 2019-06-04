import getMission from '../store/mission'
import tagText from '../utils/tagText'
import replaceText from '../utils/replaceText'
import { log } from '../utils/index'

let missionData = null
const replaceMission = (data, key) => {
  const { expMap, wordMaps, textMap } = missionData
  const text = data[key]
  let _text = text
  if (!text) return
  if (textMap.has(text)) {
    data[key] = tagText(textMap.get(text))
  } else {
    _text = replaceText(text, expMap, wordMaps)
    if (text !== _text) {
      data[key] = tagText(_text)
    }
  }
}

const processMission = (list) => {
  list.forEach(item => {
    replaceMission(item.mission, 'title')
    replaceMission(item.mission, 'comment')
    if (item.mission.missionReward.content) {
      replaceMission(item.mission.missionReward.content, 'name')
      replaceMission(item.mission.missionReward.content, 'comment')
    }
  })
}

const unknownMissions = []
const saveUnknownMissions = (data, key) => {
  if (!data[key]) return
  const text = data[key].replace(/\r?\n|\r/g, '\\n')
  if (!missionMap.has(text) && !unknownMissions.includes(text)) {
    unknownMissions.push(text)
  }
}
const collectMissions = (data) => {
  const list = data.eventUserMissions[0].userMissions
  list.forEach(item => {
    saveUnknownMissions(item.mission, 'title')
    saveUnknownMissions(item.mission, 'comment')
    if (item.mission.missionReward.content) {
      saveUnknownMissions(item.mission.missionReward.content, 'name')
      saveUnknownMissions(item.mission.missionReward.content, 'comment')
    }
  })
}

const transMission = async (data) => {
  missionData = await getMission()
  processMission(data.dailyUserMissions)
  processMission(data.weeklyUserMissions)
  data.eventUserMissions.forEach(item => {
    if (item && item.userMissions) {
      processMission(item.userMissions)
    }
  })
  processMission(data.normalUserMissions)
  processMission(data.specialUserMissions)
}

const reportMission = async (data) => {
  missionData = await getMission()
  processMission(data.reportUserMissions)
}

export { reportMission }
export default transMission
