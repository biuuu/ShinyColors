import config from '../config'
import { getHash } from '../utils/fetch'
import { isNewVersion } from '../utils/'

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

export { getLocalData, setLocalData }
