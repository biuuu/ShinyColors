import { MODULE_ID } from '../config'
import { getSupportSkill } from '../store/skill'
import replaceSkill from '../utils/replaceSkill'

const getRequest = () => {
  let request
  try {
    const moduleRequest = primJsp([],[],[MODULE_ID.REQUEST])
    request = moduleRequest.default
  } catch (e) {
    console.log(e)
  }
  return request
}

export default async function requestHook () {
  const request = getRequest()
  if (!request.get) return
  const supportSkillData = await getSupportSkill()
  const originGet = request.get
  request.get = async function (...args) {
    // console.log(...args)
    const type = args[0]
    const res = await originGet.apply(this, args)
    if (!type) return res
    if (/^userSupportIdols\/\d+$/.test(type)) {
      const sskill = res.body.supportSkills
      sskill.forEach(item => {
        item.description = '\u200b' + replaceSkill(item.description, supportSkillData)
      })
    }
    return res
  }
}
