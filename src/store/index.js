import config from '../config'
import { getHash } from '../utils/fetch'
import isString from 'lodash/isString'

let data = null

const getLocalData = async (type) => {
  // if (DEV) return false
  if (!data) {
    try {
      const str = sessionStorage.getItem('sczh:data')
      if (!str) return false
      data = JSON.parse(str)
    } catch (err) {
      console.error(err)
      return false
    }
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
  // if (DEV) return false
  if (!data || !data.hashes) data = { hashes: config.hashes }
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
    sessionStorage.setItem('sczh:data', str)
  } catch (err) {
    console.error(err)
  }
}

export { getLocalData, setLocalData }
