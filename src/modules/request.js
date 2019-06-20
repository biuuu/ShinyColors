import { getHash } from '../utils/fetch'
import transSkill from './skill'
import transMission, { reportMission } from './mission'
import { collectStoryTitle } from '../store/story'
import { userItemTypes, transShopItem, transUserItem, transShopPurchase, transFesReward, transPresentItem, transLoginBonus, transReceivePresent, transReceiveMission } from './item'
import { log } from '../utils/index'
import collectCardName from '../utils/collectCard'
import cloneDeep from 'lodash/cloneDeep'

const getRequest = async () => {
  let request
  try {
    const { moduleId } = await getHash
    const moduleRequest = primJsp([],[],[moduleId.REQUEST])
    request = moduleRequest.default
  } catch (e) {
    log(e)
  }
  return request
}

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

export default async function requestHook () {
  const request = await getRequest()
  if (!request || !request.get) return
  const originGet = request.get
  request.get = async function (...args) {
    const type = args[0]
    const res = await originGet.apply(this, args)
    if (!type) return res
    requestLog('GET', '#009688', args, res.body)
    try {
      if (/^userSupportIdols\/\d+$/.test(type) || type === 'userSupportIdols/statusMax') {
        await transSkill(res.body)
        collectStoryTitle(res.body)
      } else if (/^userIdols\/\d+$/.test(type)) {
        collectStoryTitle(res.body)
      } else if (type === 'userMissions') {
        await transMission(res.body)
      } else if (type === 'characterAlbums') {
        collectStoryTitle(res.body)
      } else if (type === 'userShops' || type === 'userIdolPieceShops') {
        await transShopItem(res.body)
      } else if (userItemTypes.includes(type)) {
        await transUserItem(res.body)
      } else if (type.includes('userPresents?limit=') || type.includes('userPresentHistories?limit=')) {
        await transPresentItem(res.body)
      } else if (type === 'gashaGroups/1673/rates') {
        if (DEV) {
          collectCardName(res.body)
        }
      }
    } catch (e) {
      log(e)
    }
    return res
  }
  const originPatch = request.patch
  request.patch = async function (...args) {
    const type = args[0]
    const res = await originPatch.apply(this, args)
    if (!type) return res
    requestLog('PATCH', '#8BC34A', args, res.body)
    try {
      if (/^userSupportIdols\/\d+$/.test(type)) {
        await transSkill(res.body.userSupportIdol)
      }
    } catch (e) {
      log(e)
    }
    return res
  }
  const originPost = request.post
  request.post = async function (...args) {
    const type = args[0]
    const res = await originPost.apply(this, args)
    if (!type) return res
    requestLog('POST', '#3F51B5', args, res.body)
    try {
      if (type === 'myPage') {
        await reportMission(res.body)
      } else if (type === 'userShops/actions/purchase') {
        await transShopPurchase(res.body)
      } else if (/produces\/\d+\/actions\/ready/.test(type)) {
        await transUserItem(res.body.userProduceItems)
      } else if (/userPresents\/\d+\/actions\/receive/.test(type)) {
        await transReceivePresent(res.body)
      } else if (/userMissions\/\d+\/actions\/receive/.test(type)) {
        await transReceiveMission(res.body)
      } else if (type === 'userLoginBonuses') {
        await transLoginBonus(res.body)
      } else if (type === 'fesTop') {
        await transFesReward(res.body)
      }
    } catch (e) {
      log(e)
    }

    return res
  }
  const originPut = request.put
  request.put = async function (...args) {
    const type = args[0]
    const res = await originPut.apply(this, args)
    if (!type) return res
    requestLog('PUT', '#9C27B0', args, res.body)
    return res
  }
}

export { requestLog }
