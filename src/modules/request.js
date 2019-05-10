import { getHash } from '../utils/fetch'
import transSkill from './skill'
import transMission from './mission'
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
    if (/^userSupportIdols\/\d+$/.test(type) || type === 'userSupportIdols/statusMax') {
      await transSkill(res.body)
    } else if (type === 'userMissions') {
      await transMission(res)
    }
    return res
  }
  const originPatch = request.patch
  request.patch = async function (...args) {
    const type = args[0]
    const res = await originPatch.apply(this, args)
    if (!type) return res
    log('patch', ...args, res.body)
    if (/^userSupportIdols\/\d+$/.test(type)) {
      await transSkill(res.body.userSupportIdol)
    }
    return res
  }
}
