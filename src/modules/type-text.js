import autoTrans from '../utils/translation'

const autoTransText = async (data, key = 'comment') => {
  const name = data.map(item => item[key]).join('').trim()
  await autoTrans(data, name, true)
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
  } catch (e) {}
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
    let list = data.userHomeDeck.userHomeDeckAnimationMember.mypageComments
    await autoTransText(list)
  } catch (e) {}
}

const fesDeckReactions = async (data) => {
  if (!data.userFesDeck) return
  try {
    let members  = data.userFesDeck.userFesDeckMembers
    for (let member of members) {
      await autoTransText(member.fesTopCharacterReactions)
    }
  } catch (e) {}
}

const produceHints = async (data) => {
  if (data.produceHints) {
    await autoTransText(data.produceHints, 'text')
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
  } catch (e) {}
}

const lessonResult = async (data) => {
  if (!data.lessonResult) return
  let lr = data.lessonResult
  try {
    let list = []
    if (lr.produceActCutinComment) list = list.concat(lr.produceActCutinComment)
    if (lr.produceActIdolComment) list = list.concat(lr.produceActIdolComment)
    // if (lr.produceActSupportIdolComments) list = list.concat(lr.produceActSupportIdolComments)
    if (lr.produceRestBoostIdolComment) list = list.concat(lr.produceRestBoostIdolComment)
    if (lr.produceRestBoostSupportIdolComment) list = list.concat(lr.produceRestBoostSupportIdolComment)
    if (lr.produceRestComments) list = list.concat(lr.produceRestComments)
    await autoTransText(list)
  } catch (e) {}
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

const characterComment = async (data) => {
  if (!data.characterComment) return
  let list = []
  list = list.concat(data.characterComment)
  await autoTransText(list)
}

export {
  mypageComments,
  fesDeckReactions,
  idolMemoryAppealComments,
  produceAudition,
  produceHints,
  topCharacterReaction,
  lessonResult,
  produceEndWeek,
  resumeGamedata,
  characterComment,
  fesMatchConcert
}