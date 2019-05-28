import { getHash } from '../utils/fetch'
import transSkill from './skill'
import transMission, { reportMission } from './mission'
import { collectStoryTitle } from '../store/story'
import { userItemTypes, transShopItem, transUserItem } from './item'
import { log } from '../utils/index'

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

export default async function requestHook () {
  const request = await getRequest()
  if (!request || !request.get) return
  const originGet = request.get
  request.get = async function (...args) {
    const type = args[0]
    const res = await originGet.apply(this, args)
    if (!type) return res
    log('get', ...args, res.body)
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
      } else if (type === 'userShops') {
        await transShopItem(res.body)
      } else if (userItemTypes.includes(type)) {
        await transUserItem(res.body)
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
    log('patch', ...args, res.body)
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
    log('post', ...args, res.body)
    try {
      if (type === 'myPage') {
        await reportMission(res.body)
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
    log('put', ...args, res.body)
    return res
  }
}
