import autoTrans from '../utils/translation'
import { log } from '../utils/index'
import { router } from './request'

const autoTransText = async (data, key = 'comment') => {
  if (!data) return
  const name = data.map(item => item[key]).join('').trim()
  await autoTrans(data, name, true)
}

const transText = async (data, key = 'comment') => {
  if (!data) return
  const name = data.map(item => item[key]).join('').trim()
  await autoTrans(data, name, true, true)
}

const idolMemoryAppealComments = async (data) => {
  if (data.idolMemoryAppealComments) {
    await autoTransText(data.idolMemoryAppealComments)
  }
}

const auditionKeys = [
  'actionComment', 'actionComment2', 'reactionComment',
  'resultLoseComment', 'resultStartComment', 'resultWinComment'
]
const produceAudition = async (data) => {
  try {
    if (data.produceAudition) {
      let name = data.produceAudition.judges.map(item => {
        return auditionKeys.map(key => item[key] || '').join('')
      }).join('').trim()
      await autoTrans(data.produceAudition.judges, name, true)
    }
    if (data.produceConcert) {
      let name = data.produceConcert.judges.map(item => {
        return auditionKeys.map(key => item[key] || '').join('')
      }).join('').trim()
      await autoTrans(data.produceConcert.judges, name, true)
    }
    if (data.produceConcertFanSkillComments) {
      await autoTransText(data.produceConcertFanSkillComments, 'comment1')
    }
  } catch (e) {
    log(e)
  }
}

const fesMatchConcert = async (data) => {
  if (data.judges) {
    let name = data.judges.map(item => {
      return auditionKeys.map(key => item[key] || '').join('')
    }).join('').trim()
    await autoTrans(data.judges, name, true)
  }
}

const mypageComments = async (data) => {
  try {
    let list = []
    if (data.userHomeDeck.userHomeDeckAnimationMember) {
      list = [...data.userHomeDeck.userHomeDeckAnimationMember.mypageComments]
    }
    let animeMembers = data.userHomeDeck.userHomeAnimationDeck.userHomeAnimationDeckMembers
    if (animeMembers) {
      animeMembers.forEach(member => {
        member.mypageComments.forEach(comm => {
          list.push(comm)
        })
        member.mypageConversations.forEach(conv => {
          conv.mypageConversationComments.forEach(comm => {
            list.push(comm)
          })
        })
      })
    }
    if (data.userHomeDeck.userHomeDeckMembers.length) {
      data.userHomeDeck.userHomeDeckMembers.forEach(member => {
        member.mypageComments.forEach(comm => {
          list.push(comm)
        })
      })
    }
    await transText(list)
  } catch (e) {
    log(e)
  }
}

const fesDeckReactions = async (data) => {
  if (!data.userFesDeck) return
  try {
    let list = []
    let members  = data.userFesDeck.userFesDeckMembers
    for (let member of members) {
      member.fesTopCharacterReactions.forEach(item => {
        list.push(item)
      })
    }
    await autoTransText(list)
  } catch (e) {
    log(e)
  }
}

const produceHints = async (data) => {
  if (data.produceHints) {
    await transText(data.produceHints, 'text')
  }
}

const topCharacterReaction = async (data) => {
  if (!data.topCharacterReaction) return
  try {
    const list = [
      ...data.topCharacterReaction.moveReactions,
      ...data.topCharacterReaction.skillReleasedReactions,
      ...data.topCharacterReaction.touchExReactions,
      ...data.topCharacterReaction.touchReactions,
      ...data.topCharacterReaction.waitReactions
    ]
    await autoTransText(list)
  } catch (e) {
    log(e)
  }
}

const lessonResult = async (data) => {
  if (!data.lessonResult) return
  let lr = data.lessonResult
  try {
    let list = []
    if (lr.produceActCutinComment) list = list.concat(lr.produceActCutinComment)
    // if (lr.produceActIdolComment) list = list.concat(lr.produceActIdolComment)
    // if (lr.produceActSupportIdolComments) list = list.concat(lr.produceActSupportIdolComments)
    if (lr.produceRestBoostIdolComment) list = list.concat(lr.produceRestBoostIdolComment)
    if (lr.produceRestBoostSupportIdolComment) list = list.concat(lr.produceRestBoostSupportIdolComment)
    if (lr.produceRestComments) list = list.concat(lr.produceRestComments)
    await autoTransText(list)
  } catch (e) {
    log(e)
  }
}

const produceEndWeek = async (data) => {
  let staff = data.produceStaffComments || []
  let concert = data.produceStaffConcertComments || []
  let fail = data.produceStaffFailComments || []
  let season = data.produceStaffSeasonComments || []
  let list = [...staff, ...concert, ...fail, ...season]
  await autoTransText(list)
}

const resumeGamedata = async (data) => {
  if (!data.gameData) return
  try {
    let gData = JSON.parse(data.gameData)
    if (gData.judges) {
      await fesMatchConcert(gData)
    } else {
      await produceAudition(gData)
    }
    data.gameData = JSON.stringify(gData)
  } catch (e) {
    log(e)
  }
}

const resumeRaidGamedata = async (data) => {
  if (!data.gameState || !data.gameState.game_data) return
  try {
    let gData = JSON.parse(data.gameState.game_data)
    if (gData.judges) {
      await fesMatchConcert(gData)
    }
    data.gameState.game_data = JSON.stringify(gData)
  } catch (e) {
    log(e)
  }
}

const characterComment = async (data) => {
  if (!data.characterComment) return
  let list = []
  list = list.concat(data.characterComment)
  await autoTransText(list)
}

const helperSupportIdols = async (data) => {
  try {
    let name = data.characterComment + data.producerComment
    await autoTrans([data], name, true)
  } catch (e) {
    log(e)
  }
}

const produceReporterAnswer = async (data) => {
  try {
    await autoTransText(data.produceReporterEvent?.produceReporterEventAnswers, 'comment2')
  } catch (e) {
    log(e)
  }
}

const trustLevelUp = async (data) => {
  try {
    let list = data.characterTrustLevelUpComments
    await autoTransText(list)
  } catch (e) {
    log(e)
  }
}

router.get([
  ['userProduces', topCharacterReaction],
  ['fes(Match)?Concert/actions/resume', resumeGamedata],
])

router.post([
  ['myPage', mypageComments],
  ['fesTop', fesDeckReactions],
  ['produces/actions/(resume|next)', [topCharacterReaction, produceEndWeek, resumeGamedata, characterComment, produceAudition, produceReporterAnswer]],
  ['produces/actions/endWeek', produceEndWeek],
  ['produces/actions/act', lessonResult],
  ['fes(Match|Raid)?Concert/actions/start', fesMatchConcert],
  ['fes(Match)?Concert/actions/resume', resumeGamedata],
  ['fesRaidConcert/actions/resume', resumeRaidGamedata],
  ['produces/actions/result', trustLevelUp],
  ['produces/({num}/audition|concert)/actions/(start|finish)', [produceAudition, characterComment]],
  ['userProduceHelperSupportIdols', helperSupportIdols],
])

export { transText }