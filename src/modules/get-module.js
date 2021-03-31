import { getHash } from '../utils/fetch'

let require = null

const conditions = new Map([
  ['AOBA', (module) => {
    return module && module.loaders && module.Text && module.BLEND_MODES
  }],
  ['SCENARIO', (module) => {
    return module && module.default && module.default['load'] && module.default['_errorEvent'] && module.default['_handleError']
  }],
  ['REQUEST', (module) => {
    return module && module.get && module.post && module.put && module.patch
  }],
  ['PHRASE', (module) => {
    return module && module.default && module.default._polyglot && module.default._polyglot.phrases
  }],
  ['SPEAKER', (module) => {
    return module && module.default && module.default.getCharacterBackLogIconId
  }]
])

const resultMap = new Map([
  ['AOBA', (module) => module],
  ['SCENARIO', (module) => module.default],
  ['REQUEST', (module) => module],
  ['PHRASE', (module) => module.default._polyglot.phrases],
  ['SPEAKER', (module) => module.default]
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
// let unfreezeflag = false
// const tryUnfreeze = (id) => {
//   if (unfreezeflag) return
//   unfreezeflag = true
//   for (let key in require) {
//     const obj = require[key]
//     if (obj && obj[0]?.exports?.loaders) {
//       obj[id].exports = Object.assign({}, obj[id].exports)

//       obj[id].exports.request.bind = (function (arg) {

//         return obj[id].exports.request
//       }).bind(obj[id].exports)
//       return obj[id].exports
//     }
//   }
// }

const originCall = Function.prototype.call
let win = { Reflect: window.Reflect }
Function.prototype.call = new Proxy(originCall, {
  apply (target, self, args) {
    if (args?.[3]?.toString) {
      if (args[3].toString() === 'function i(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,i),r.l=!0,r.exports}') {
        if (args[3].caller?.arguments?.[0]?.length > 1000) {
          require = args[3]
          if (ENVIRONMENT === 'development') unsafeWindow._require = require
          Function.prototype.call = originCall
        }
      }
    }
    return win.Reflect.apply(target, self, args)
  }
})

let OFFSET = 20
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
    let _module = require(idList[i])
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
  // if (!unfreezeflag && name === 'REQUEST') {
  //   md = tryUnfreeze(id)
  // }
  return md ? resultMap.get(name)(md) : null
}

export {
  getModule, isReady
}