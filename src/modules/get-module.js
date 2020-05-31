import { log } from '../utils/'
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
  }]
])

const resultMap = new Map([
  ['AOBA', (module) => module],
  ['SCENARIO', (module) => module.default],
  ['REQUEST', (module) => module],
  ['PHRASE', (module) => module.default._polyglot.phrases]
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

const originCall = Function.prototype.call
let win = { Reflect: window.Reflect }
Function.prototype.call = new Proxy(originCall, {
  apply (target, self, args) {
    if (args?.[3]?.toString) {
      if (args[3].toString() === 'function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}') {
        require = args[3]
        Function.prototype.call = originCall
      }
    }
    return win.Reflect.apply(target, self, args)
  }
})

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
    let _module = require(idList[i])
    if (conditionFunc(_module)) {
      module = _module
      break
    }
  }
  return module
}

const getModule = async (name) => {
  const { moduleId } = await getHash
  const md = findModule(moduleId[name], conditions.get(name))
  return resultMap.get(name)(md)
}

export {
  getModule, isReady
}