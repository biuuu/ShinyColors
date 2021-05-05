import config from '../config'
import fetchData, { getHash } from '../utils/fetch'
import { isNewVersion, trimWrap } from '../utils/'
import parseCsv from '../utils/parseCsv'
import sortWords from '../utils/sortWords'

let data = null

const getLocalData = async (type) => {
  if (ENVIRONMENT === 'development') return false
  if (!data) {
    try {
      const str = localStorage.getItem('sczh:data')
      if (!str) return false
      data = JSON.parse(str)
    } catch (err) {
      console.error(err)
      return false
    }
  }
  if (isNewVersion(config.version, data.version)) {
    data = null
    localStorage.removeItem('sczh:data')
    return false
  }
  let key = type
  if (!/(\.csv|\.json)/.test(type)) {
    key = `${type}.csv`
  }
  const { hashes } = await getHash
  const newHash = hashes[key]
  const savedHash = data.hashes[key]
  if (savedHash && savedHash === newHash) {
    return data[type]
  } else {
    data.hashes[key] = newHash
    return false
  }
}

const setLocalData = (type, value) => {
  if (ENVIRONMENT === 'development') return false
  if (!data || !data.hashes) data = { hashes: config.hashes, version: config.version }
  let key = type
  if (!/(\.csv|\.json)/.test(type)) {
    key = `${type}.csv`
  }
  const newHash = config.hashes[key]
  if (newHash) {
    data.hashes[key] = newHash
  }
  data[type] = value
  const str = JSON.stringify(data)
  try {
    localStorage.setItem('sczh:data', str)
  } catch (err) {
    console.error(err)
  }
}

const listMap = new Map()
const getList = async (name, path) => {
  const csvPath = path || name
  if (listMap.has(name)) {
    return listMap.get(name)
  }
  let csv = await getLocalData(name)
  if (!csv) {
    csv = await fetchData(`/data/${csvPath}.csv`)
    setLocalData(name, csv)
  }
  const list = parseCsv(csv)
  listMap.set(name, list)
  return list
}

const commonStore = (option) => {
  const dataMap = new Map()
  let loaded = false

  const { name, path } = option
  const keys = option.keys || {}
  const textKey = keys.text || 'text'
  const transKey = keys.trans || 'trans'

  const getData = async () => {
    if (!loaded) {
      const list = await getList(name, path)
      if (option.sort) {
        sortWords(list, option.sort)
      }
      list.forEach(item => {
        const text = trimWrap(item[textKey])
        const trans = trimWrap(item[transKey], true)
        if (text && trans) {
          dataMap.set(text, trans)
        }
      })
      loaded = true
    }
    return dataMap
  }

  return getData
}


export { getLocalData, setLocalData, getList, commonStore }
