import transApi from './api-comm'
import { transItemName, transItemDesc, ensureItemData } from './item'
import config from '../config'
import { log } from '../utils/index'

const { api, transItem } = transApi('mission', ensureItemData)

const processReward = (data, key) => {
  let transed = transItem(data, key)
  if (!transed) {
    if (key === 'name') {
      transItemName(data, key)
    } else {
      transItemDesc(data, key)
    }
  }
}

const transTextList = (list) => {
  if (!list) return
  const unTransList = []
  for (let i = 0; i < list.length; i++) {
    let txt = list[i]
    transItem(list, i)
    if (txt === list[i]) {
      unTransList.push(txt)
    }
  }
  if (config.dev && unTransList.length) {
    log(unTransList.join('\n'))
  }
}

const processMission = (list) => {
  list?.forEach(item => {
    transItem(item.mission, 'title')
    transItem(item.mission, 'comment')
    if (item.mission.missionReward.content) {
      processReward(item.mission.missionReward.content, 'name')
      processReward(item.mission.missionReward.content, 'comment')
    }
  })
}

const processRaidMission = (list) => {
  list.forEach(item => {
    let mission = item.fesRaidAccumulatedReward
    transItem(mission, 'title')
    transItem(mission, 'comment')
    let content = mission.fesRaidAccumulatedRewardContent
    if (content?.content) {
      processReward(content.content, 'name')
      processReward(content.content, 'comment')
    }
  })
}

const fullMission = (list, hasReward = true) => {
  list?.forEach(item => {
    let mission = item.mission || item
    transItem(mission, 'title')
    transItem(mission, 'comment')
    transItem(mission, 'afterAchievedComment')
    transItem(mission, 'beforeAchievedComment')
    if (hasReward) {
      let reward = mission.lectureMissionReward
      if (reward?.content) {
        processReward(reward.content, 'name')
        processReward(reward.content, 'comment')
      }
    }
  })
}

const transMission = (data) => {
  processMission(data.dailyUserMissions)
  processMission(data.weeklyUserMissions)
  data.eventUserMissions?.forEach(item => {
    processMission(item?.userMissions)
  })
  processMission(data.normalUserMissions)
  processMission(data.specialUserMissions)
  processMission(data.fesMatchRankingUserMissions)
}

const reportMission = (data) => {
  processMission(data.reportUserMissions)
}

const beginnerMissionComplete = (data) => {
  let mission = data.beginnerMission
  if (mission) {
    if (mission.clearedLectureMission) {
      fullMission([mission.clearedLectureMission])
    }
    if (mission.progressLectureMission) {
      fullMission([mission.progressLectureMission])
    }
  }
}

const fesRecomMission = (data) => {
  transItem(data.userRecommendedMission?.mission, 'comment')
  transItem(data.userRecommendedMission?.mission, 'title')
  data.accumulatedPresent.userGameEventAccumulatedPresents.forEach(item => {
    transItem(item.gameEventAccumulatedPresent, 'comment')
    transItem(item.gameEventAccumulatedPresent, 'title')
  })
}

const fesRaidMission = (data) => {
  processRaidMission(data.fesRaidBestScoreRewards)
  processRaidMission(data.fesRaidLapRewards)
  processRaidMission(data.fesRaidPointRewards)
}

const teachingMission = (data) => {
  data.teachingHints?.forEach(item => {
    item.userProduceHints?.forEach(hint => {
      transItem(hint.produceTeachingHint, 'title')
    })
    item.userProduceTeachingHints?.forEach(hint => {
      transItem(hint.produceTeachingHint, 'title')
    })
  })
}

const beginnerMission = (data) => {
  fullMission(data.lectureMissions)
}

const idolRoadRewards = (idol) => {
  idol.userIdolRoad?.idolRoad.idolRoadRewards.forEach(reward => {
    processReward(reward.content, 'name')
    processReward(reward.content, 'comment')
  })
}

const idolRoadMission = (data) => {
  fullMission(data.userMissions, false)
  data.userIdols?.forEach(idolRoadRewards)
}

const idolRoadForward = (data) => {
  idolRoadRewards(data.userIdol)
}

const producerDesk = (data) => {
  transTextList(data.producerDesk?.messages)
}

const producerLevelRewards = (data) => {
  data.producerLevelRewards.forEach(item => {
    transItem(item, 'title')
    processReward(item.content, 'name')
  })
}

const producerProgress = (data) => {
  data.progresses.forEach(item => {
    transItem(item, 'comment')
    transItem(item, 'title')
  })
}

api.get([
  ['userMissions', transMission],
  ['fesRaidEvents/{num}/rewards', fesRaidMission],
  ['userProduces', [teachingMission]],
  ['userBeginnerMissions/top', beginnerMission],
  ['idolRoads/top', idolRoadMission],
  ['missionEvents/{num}/top', [fesRecomMission]],
  ['producerDesk/rewards', producerLevelRewards]
])

api.post([
  ['myPage', [reportMission, beginnerMissionComplete, producerDesk]],
  ['(produceMarathons|fesMarathons|trainingEvents)/{num}/top', [fesRecomMission]],
  [['produceTeachings/resume', 'produceTeachings/next'], teachingMission],
  ['userLectureMissions/{num}/actions/receive', beginnerMission],
  ['producerDesk/top', producerProgress]
])

api.put([
  ['userIdolRoads', idolRoadForward]
])