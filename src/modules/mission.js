import getMission from '../store/mission'
import tagText from '../utils/tagText'
import { log } from '../utils/index'

let missionMap = null
const replaceText = (data, key) => {
  if (data[key] && missionMap.has(data[key])) {
    data[key] = tagText(missionMap.get(data[key]))
  }
}

const processMission = (list) => {
  list.forEach(item => {
    replaceText(item.mission, 'title')
    replaceText(item.mission, 'comment')
    if (item.mission.missionReward.content) {
      replaceText(item.mission.missionReward.content, 'name')
      replaceText(item.mission.missionReward.content, 'comment')
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
  // if (ENVIRONMENT === 'development') {
  //   missionMap = await getMission(true)
  //   collectMissions(data)
  //   log(unknownMissions.join(',\n'))
  //   return
  // }
  missionMap = await getMission()
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
  missionMap = await getMission()
  processMission(data.reportUserMissions)
}

export { reportMission }
export default transMission
