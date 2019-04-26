import { MODULE_ID } from '../config'
import { getSupportSkill } from '../store/skill'
import replaceSkill from '../utils/replaceSkill'
import tagText from '../utils/tagText'
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
  const supportSkillData = await getSupportSkill()
  const originGet = request.get
  request.get = async function (...args) {
    log(...args)
    const type = args[0]
    const res = await originGet.apply(this, args)
    if (!type) return res
    log(res.body)
    if (/^userSupportIdols\/\d+$/.test(type) || type === 'userSupportIdols/statusMax') {
      const sskill = res.body.supportSkills
      const asskill = res.body.acquiredSupportSkills
      sskill.forEach(item => {
        item.description = tagText(replaceSkill(item.description, supportSkillData))
      })
      asskill && asskill.forEach(item => {
        item.description = tagText(replaceSkill(item.description, supportSkillData))
      })
    }
    return res
  }
}
