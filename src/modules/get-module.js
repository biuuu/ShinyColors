import { getHash } from '../utils/fetch'

let require = null

const conditions = new Map([
  ['AOBA', (module) => {
    return module && module.loaders && module.Text && module.BLEND_MODES
  }],
  ['SCENARIO', (module) => {
    return module && module.Z && module.Z['load'] && module.Z['_errorEvent'] && module.Z['_handleError']
  }],
  ['REQUEST', (module) => {
    return module?.Z?._encryptRequest
  }],
  ['PHRASE', (module) => {
    return module?.Z?._polyglot?.phrases
  }],
  ['WEBP', (module) => {
    return module?.Z?.isSupportedWebP
  }]
])

const resultMap = new Map([
  ['AOBA', (module) => module],
  ['SCENARIO', (module) => module.Z],
  ['REQUEST', (module) => module.Z],
  ['PHRASE', (module) => module.Z._polyglot.phrases],
  ['WEBP', (module) => module.Z]
])

const isReady = () => {
  return !!require
}

const originFreeze = Object.freeze

Object.freeze = new Proxy(originFreeze, {
  apply (target, self, [data]) {
    return data
  }
})

const requireRegExp = /^function\s\w\((\w)\){var\s(\w)=(\w)\[\1\];if\(void\s0!==\2\)return\s\2\.exports;var\s(\w)=\3\[\1\]={id:\1,loaded:!1,exports:{}};return\s\w\[\1\]\.call\(\4\.exports,\4,\4\.exports,\w\),\4\.loaded=!0,\4\.exports}$/
const originCall = Function.prototype.call
let win = { Reflect: window.Reflect }
Function.prototype.call = new Proxy(originCall, {
  apply (target, self, args) {
    if (args?.[3]?.toString) {
      if (requireRegExp.test(args[3].toString())) {
        require = args[3]
        if (ENVIRONMENT === 'development') unsafeWindow._require = require
        Function.prototype.call = originCall
      }
    }
    return win.Reflect.apply(target, self, args)
  }
})

let OFFSET = 50
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
  let realId
  for (let i = 0; i < idList.length; i++) {
    let _module
    try {
      _module = require(idList[i])
    } catch (e) {}
    if (conditionFunc(_module)) {
      module = _module
      realId = idList[i]
      break
    }
  }
  return [module, realId]
}

const getModule = async (name) => {
  const { moduleId } = await getHash
  let [md, id] = findModule(moduleId[name], conditions.get(name))
  return md ? resultMap.get(name)(md) : null
}

export {
  getModule, isReady
}