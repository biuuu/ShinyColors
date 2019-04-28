import { MODULE_ID } from '../config'
import transSkill from './skill'
import transMission from './mission'
import { log } from '../utils/index'

const getRequest = () => {
  let request
  try {
    const moduleRequest = primJsp([],[],[MODULE_ID.REQUEST])
    request = moduleRequest.default
  } catch (e) {
    log(e)
  }
  return request
}

export default async function requestHook () {
  const request = getRequest()
  if (!request.get) return
  const originGet = request.get
  request.get = async function (...args) {
    log(...args)
    const type = args[0]
    const res = await originGet.apply(this, args)
    if (!type) return res
    log(res.body)
    if (/^userSupportIdols\/\d+$/.test(type) || type === 'userSupportIdols/statusMax') {
      await transSkill(res)
    } else if (type === 'userMissions') {
      await transMission(res)
    }
    return res
  }
}
