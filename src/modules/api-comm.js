import { replaceItem } from '../utils/replaceText'
import { log, makePromise } from '../utils/index'
import tagText from '../utils/tagText'
import { router } from './request'
import getCommApiData from '../store/api-comm'

const transApi = (type) => {
  let commData = null
  const getData = getCommApiData(type)
  const ensureData = makePromise(getData)
  const internalCb = (callback) => {
    return async (data) => {
      if (!commData) {
        commData = await ensureData()
      }
      callback(data)
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

  const nameWithPlus = (list, data) => {
    if (data) {
      list.forEach((str, index) => {
        list[index] = str + data[index]
      })
    } else {
      let arr = []
      list.forEach((str, index) => {
        let rgs = str.match(/([＋+]+)$/)
        if (rgs?.[1]) {
          arr.push(rgs[1])
          list[index] = str.replace(/[＋+]+$/, '')
        } else {
          arr.push('')
        }
      })
      return arr
    }
  }

  const transItem = (item, key, data = commData) => {
    if (item?.[key]) {
      let arr = item[key].split('/')
      arr.forEach((txt, index) => {
        let plusList = nameWithPlus(arr)
        replaceItem(arr, index, data)
        nameWithPlus(arr, plusList)
      })
      let text = arr.join('/')
      if (text !== item[key]) {
        item[key] = text
      } else {
        // log(text)
      }
    }
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
    transItem
  }
}

export default transApi