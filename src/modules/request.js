import { supportSkill, userIdolsSkill, produceExSkillTop, 
  userFesIdolsSkill, userSptIdolsSkill, reserveUserIdolsSkill, noteResultSkill,
  otherFesIdolSkill, reserveUserSptIdolsSkill, userFesDeck, ideaNotesSkill,
  userProIdolsSkill, userProSptIdolsSkill, proSkillPanels, produceFinish,
  fesMatchConcertSkill, resumeGameSkill, auditionSkill, produceResultSkill } from './skill'
import transMission, { reportMission, fesRecomMission, fesRaidMission, teachingMission, beginnerMission, beginnerMissionComplete } from './mission'
import { collectStoryTitle } from '../store/story'
import { userItemTypes, transShopItem,
  transUserItem, transShopPurchase, transFesReward, transAccumulatedPresent,
  transPresentItem, transLoginBonus, transReceivePresent,
  transReceiveMission, selectLoginBonus } from './item'
import { mypageComments, fesDeckReactions, produceAudition, resumeGamedata,
  trustLevelUp, produceReporterAnswer, topCharacterReaction, helperSupportIdols,
  produceEndWeek, lessonResult, characterComment, fesMatchConcert } from './type-text'
import { log } from '../utils/index'
import collectCardName from '../utils/collectCard'
import cloneDeep from 'lodash/cloneDeep'
import isString from 'lodash/isString'
import isRegExp from 'lodash/isRegExp'
import { getRequest } from './get-module'

const logStyles = color => ([
  `background-color:${color};color:#fff;padding:0 0.3em`,
  '',
  `color:${color};text-decoration:underline`
])

const requestLog = (method, color, args, data) => {
  if (DEV) {
    let _data = data
    if (data) {
      _data = cloneDeep(data)
    }
    log(`%c${method}%c %c${args[0]}`, ...logStyles(color), args[1] || '', '\n=>', _data)
  }
}

const requestRouter = async (data, type, list) => {
  try {
    for (let [paths, handles] of list) {
      if (!Array.isArray(paths)) paths = [paths]
      let pass = false
      for (let path of paths) {
        if (isString(path) && path === type) {
          pass = true
        } else if (isRegExp(path) && path.test(type)) {
          pass = true
        }
      }
      if (pass) {
        if (!Array.isArray(handles)) handles = [handles]
        for (let handle of handles) {
          if (isString(handle)) {
            if (handle === 'storyTitle') collectStoryTitle(data)
            else if (handle === 'cardName') collectCardName(data)
          } else {
            await handle(data)
          }
        }
      }
    }
  } catch (e) {
    log(e)
  }
}

const requestOfGet = [
  [[/^userSupportIdols\/\d+$/, /^userSupportIdols\/statusMax/, /^produceTeachingSupportIdols\/\d+$/], [supportSkill, userSptIdolsSkill, 'storyTitle']],
  [/^userProduce(Teaching)?SupportIdols\/\d+$/, [supportSkill, userProSptIdolsSkill]],
  [/^userReserveSupportIdols\/userSupportIdol\/\d+$/, [supportSkill, reserveUserSptIdolsSkill]],
  [/^userIdols\/\d+\/produceExSkillTop$/, produceExSkillTop],
  [/^userSupportIdols\/\d+\/produceExSkillTop$/, produceExSkillTop],
  [[/^userIdols\/\d+$/, /^userIdols\/statusMax$/, /^produceTeachingIdols\/\d+$/], [userIdolsSkill, 'storyTitle']],
  [[/^userProduce(Teaching)?Idols\/\d+$/, 'userProduceTeachingIdol'], userProIdolsSkill],
  [/^userReserveIdols\/userIdol\/\d+$/, reserveUserIdolsSkill],
  [/^userFesIdols\/\d+$/, userFesIdolsSkill],
  [['userProduces/skillPanels', 'userProduceTeachings/skillPanels'], proSkillPanels],
  ['userMissions', transMission],
  [/^fesRaidEvents\/\d+\/rewards$/, fesRaidMission],
  [['characterAlbums', 'album/top'], 'storyTitle'],
  [['userShops', 'userIdolPieceShops'], transShopItem],
  [userItemTypes, transUserItem],
  [[/^userPresents\?limit=/, /^userPresentHistories\?limit=/], transPresentItem],
  [/gashaGroups\/\d+\/rates/, 'cardName'],
  ['userProduces', [topCharacterReaction]],
  [/^fes(Match)?Concert\/actions\/resume$/, [resumeGamedata, resumeGameSkill]],
  [/earthUsers\/[^\/]+\/userFesIdols\/\d+$/, otherFesIdolSkill],
  ['userBeginnerMissions/top', beginnerMission]
]

const requestOfPost = [
  ['myPage', [reportMission, mypageComments, beginnerMissionComplete]],
  [/^characterAlbums\/characters\/\d+$/, 'storyTitle'],
  [/^(produceMarathons|fesMarathons|trainingEvents)\/\d+\/top$/, [fesRecomMission, transAccumulatedPresent]],
  [/userIdols\/\d+\/produceExSkills\/\d+\/actions\/set/, userIdolsSkill],
  ['userShops/actions/purchase', transShopPurchase],
  [/produces\/\d+\/actions\/ready/, transUserItem],
  [/userPresents\/\d+\/actions\/receive/, transReceivePresent],
  [/userMissions\/\d+\/actions\/receive/, transReceiveMission],
  ['userLoginBonuses', transLoginBonus],
  ['fesTop', [transFesReward, fesDeckReactions]],
  [[/^userProduce(Teaching)?s\/skillPanels\/\d+$/, /^userProduces\/limitedSkills\/\d+$/], proSkillPanels],
  [/userSupportIdols\/\d+\/produceExSkills\/\d+\/actions\/set/, [ userSptIdolsSkill, supportSkill]],
  [/^produces\/actions\/(resume|next)$/, [ideaNotesSkill, topCharacterReaction, produceEndWeek, resumeGamedata, characterComment, produceAudition, produceReporterAnswer, supportSkill]],
  [['produces/actions/resume', 'produces/actions/finish', 'produceTeachings/resume'], [produceFinish, resumeGameSkill]],
  ['produces/actions/endWeek', produceEndWeek],
  ['produces/actions/act', [lessonResult, noteResultSkill]],
  [/^fes(Match)?Concert\/actions\/start$/, [fesMatchConcert, fesMatchConcertSkill]],
  [/^fes(Match)?Concert\/actions\/resume$/, [resumeGamedata, resumeGameSkill]],
  ['produces/actions/result', [trustLevelUp, produceResultSkill]],
  [[/^produce(Teaching)?s\/(\d+\/audition|concert)\/actions\/start$/, /^produceTeachings\/(auditions|concerts)\/start$/], [auditionSkill]],
  [/^produces\/(\d+\/audition|concert)\/actions\/(start|finish)$/, [produceAudition, characterComment]],
  ['userProduceHelperSupportIdols', helperSupportIdols],
  [['produceTeachings/resume', 'produceTeachings/next'], [teachingMission, supportSkill]],
  [/^userSelectLoginBonuses\/\d+$/, selectLoginBonus],
  [/^userLectureMissions\/\d+\/actions\/receive$/, beginnerMission]
]

const requestOfPatch = [
  [/^userSupportIdols\/\d+$/, supportSkill],
  ['userFesDecks', userFesDeck]
]

export default async function requestHook () {
  const request = await getRequest()
  if (!request || !request.get) return

  // GET
  const originGet = request.get
  request.get = async function (...args) {
    const type = args[0]
    const res = await originGet.apply(this, args)
    if (!type) return res
    let data = res.body
    requestLog('GET', '#009688', args, data)
    await requestRouter(data, type, requestOfGet)
    return res
  }

  // PATCH
  const originPatch = request.patch
  request.patch = async function (...args) {
    const type = args[0]
    const res = await originPatch.apply(this, args)
    if (!type) return res
    let data = res.body
    requestLog('PATCH', '#8BC34A', args, data)
    await requestRouter(data, type, requestOfPatch)
    return res
  }

  // POST
  const originPost = request.post
  request.post = async function (...args) {
    const type = args[0]
    const res = await originPost.apply(this, args)
    if (!type) return res
    let data = res.body
    requestLog('POST', '#3F51B5', args, data)
    await requestRouter(data, type, requestOfPost)
    return res
  }

  // PUT
  const originPut = request.put
  request.put = async function (...args) {
    const type = args[0]
    const res = await originPut.apply(this, args)
    if (!type) return res
    let data = res.body
    requestLog('PUT', '#9C27B0', args, data)
    return res
  }
}

export { requestLog }
