import { log } from '../utils/index'
import { getHash } from '../utils/fetch'

let OFFSET = 10
const setIdList = (id, offset) => {
  let start = id - offset
  let end = id + offset
  let list = []
  for (let i = start; i <= end; i++) {
    if (i >= 0 && i !== id) {
      list.push(i)
    }
  }
  list.unshift(id)
  return list
}

const findModule = (id, conditionFunc) => {
  let idList = setIdList(id, OFFSET)
  let module
  for (let i = 0; i < idList.length; i++) {
    let cid = idList[i]
    let _module = _require(cid)
    if (conditionFunc(_module)) {
      module = _module
      break
    }
  }
  return module
}

const getModule = async (name, condition) => {
  let md
  try {
    const { moduleId } = await getHash
    md = findModule(moduleId[name], condition)
  } catch (e) {
    log(e)
  }
  if (!md) {
    throw new Error(`${name} NOT FOUND.`)
  }
  return md
}

const getAoba = async () => {
  let aoba = await getModule('AOBA', (module) => {
    return module.loaders && module.Text && module.BLEND_MODES
  })
  return aoba
}

const getScMd = async () => {
  let scMd = await getModule('SCENARIO', (module) => {
    return module.default && module.default['load'] && module.default['_errorEvent'] && module.default['_handleError']
  })
  return scMd.default
}

const getRequest = async () => {
  let md = await getModule('REQUEST', (module) => {
    return module.get && module.post && module.put && module.patch
  })
  md = Object.assign({}, md)
  return md
}

const getPhraseMd = async () => {
  let md = await getModule('PHRASE', (module) => {
    return module.default && module.default._polyglot && module.default._polyglot.phrases
  })
  return md.default._polyglot.phrases
}

export {
  getAoba, getScMd, getRequest, getPhraseMd
}