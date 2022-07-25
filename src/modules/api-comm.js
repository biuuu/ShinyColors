import { replaceItem, transText } from '../utils/replaceText'
import { log, makePromise } from '../utils/index'
import { router } from './request'
import getCommApiData from '../store/api-comm'

const transApi = (type, ensureMoreData) => {
  let commData = null
  const getData = getCommApiData(type)
  const ensureData = makePromise(getData)
  const internalCb = (callback) => {
    return async (data) => {
      if (!commData) {
        commData = await ensureData()
        if (ensureMoreData) {
          await ensureMoreData()
        }
      }
      if (callback) {
        callback(data)
      }
      return commData
    }
  }

  const processRouter = (list) => {
    return list.map(item => {
      const target = item[1]
      if (Array.isArray(target)) {
        item[1] = target.map(func => internalCb(func))
      } else {
        item[1] = internalCb(target)
      }
      return item
    })
  }

  const transWithPlus = (text, data) => {
    const reMatch = text.match(/(.+?)([＋+]+)$/)
    if (!reMatch) return transText(text, data)
    return transText(reMatch[1], data) + reMatch[2]
  }

  const transWithSlash = (text, data) => {
    const arr = text.split('/')
    return arr.map(txt => {
      return transWithPlus(txt, data)
    }).join('/')
  }

  const transItem = (item, key, data = commData) => {
    if (item?.[key]) {
      let result = transWithPlus(item[key], data)
      if (result !== item[key]) {
        return item[key] = result
      }
      result = transWithSlash(item[key], data)
      if (result !== item[key]) {
        item[key] = result
      }
    }
  }

  const getTransItem = (callback) => (item, key) => {
    callback(item, key, commData)
  }

  return {
    api: {
      get (list) {
        router.get(processRouter(list))
      },
      post (list) {
        router.post(processRouter(list))
      },
      put (list) {
        router.put(processRouter(list))
      },
      patch (list) {
        router.patch(processRouter(list))
      }
    },
    transItem,
    getTransItem,
    ensureData: internalCb()
  }
}

export default transApi