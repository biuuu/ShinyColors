import replaceText from '../utils/replaceText'
import tagText from '../utils/tagText'
import { log } from '../utils/index'

let list = []
const pushTo = (text) => {
  if (text && !list.includes(text)) {
    list.push(text.replace(/\r/g, '').replace(/\n/g, '\\n'))
  }
}
const saveMission = (arr) => {
  arr.forEach(item => {
    pushTo(item.mission.title)
    pushTo(item.mission.comment)
    if (item.mission.missionReward.content) {
      pushTo(item.mission.missionReward.content.name)
      pushTo(item.mission.missionReward.content.comment)
    }
  })
}
const transMission = async (res) => {
  // saveMission(res.body.dailyUserMissions)
  // saveMission(res.body.weeklyUserMissions)
  // saveMission(res.body.eventUserMissions[0].userMissions)
  // saveMission(res.body.normalUserMissions)
  // saveMission(res.body.specialUserMissions)
  // log(list.join(',\n'))
}

export default transMission
