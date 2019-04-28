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
const transMission = async (res) => {
  missionMap = await getMission()
  processMission(res.body.dailyUserMissions)
  processMission(res.body.weeklyUserMissions)
  res.body.eventUserMissions.forEach(item => {
    if (item && item.userMissions) {
      processMission(item.userMissions)
    }
  })
  processMission(res.body.normalUserMissions)
  processMission(res.body.specialUserMissions)
}

export default transMission
