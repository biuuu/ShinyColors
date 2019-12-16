import getMission from '../store/mission'
import tagText from '../utils/tagText'
import replaceText from '../utils/replaceText'
import { fixWrap, replaceWrap, log } from '../utils/index'

let missionData = null
let msPrms = null
const ensureMissionData = async () => {
  if (!msPrms) {
    msPrms = getMission()
  }
  missionData = await msPrms
  return missionData
}

const replaceMission = (data, key) => {
  if (!data) return
  const { expMap, wordMaps, textMap } = missionData
  const text = fixWrap(data[key])
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

const processRaidMission = (list) => {
  list.forEach(item => {
    let mission = item.fesRaidAccumulatedReward
    replaceMission(mission, 'title')
    replaceMission(mission, 'comment')
    let content = mission.fesRaidAccumulatedRewardContent
    if (content && content.content) {
      replaceMission(content.content, 'name')
      replaceMission(content.content, 'comment')
    }
  })
}

const unknownMissions = []
const saveUnknownMissions = (data, key) => {
  if (!data[key]) return
  const text = replaceWrap(data[key])
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
  await ensureMissionData()
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
  await ensureMissionData()
  processMission(data.reportUserMissions)
}

const accumulatedPresent = (item, key) => {
  if (item && item[key]) {
    item[key] = tagText(item[key].replace(/イベントミッションを(\d+)個達成しよう/, '完成$1个活动任务'))
  }
}

const fesRecomMission = async (data) => {
  await ensureMissionData()
  replaceMission(data.userRecommendedMission.mission, 'comment')
  replaceMission(data.userRecommendedMission.mission, 'title')
  data.accumulatedPresent.userGameEventAccumulatedPresents.forEach(item => {
    replaceMission(item.gameEventAccumulatedPresent, 'comment')
    replaceMission(item.gameEventAccumulatedPresent, 'title')
  })
}

const fesRaidMission = async (data) => {
  await ensureMissionData()
  processRaidMission(data.fesRaidBestScoreRewards)
  processRaidMission(data.fesRaidLapRewards)
  processRaidMission(data.fesRaidPointRewards)
}

const teachingMission = async (data) => {
  await ensureMissionData()
  data.teachingHints && data.teachingHints.forEach(item => {
    item.userProduceTeachingHints.forEach(hint => {
      replaceMission(hint.produceTeachingHint, 'title')
    })
  })
}

export { reportMission, fesRecomMission, fesRaidMission, teachingMission }
export default transMission
