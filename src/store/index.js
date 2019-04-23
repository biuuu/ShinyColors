import config from '../config'
import { getHash } from '../utils/fetch'

let data = null

const getLocalData = async (type) => {
  if (data) return data[type]
  const hash = await getHash
  try {
    const str = sessionStorage.getItem('sczh:data')
    if (!str) return false
    data = JSON.parse(str)
    if (data.hash !== hash) {
      data = null
      sessionStorage.removeItem('sczh:data')
      localStorage.removeItem('sczh:data')
      return false
    }
    return data[type]
  } catch (err) {
    console.log(err)
  }
  return false
}

const setLocalData = (type, value) => {
  if (!data) data = { hash: config.hash }
  data[type] = value
  const str = JSON.stringify(data)
  try {
    sessionStorage.setItem('sczh:data', str)
  } catch (err) {
    console.log(err)
  }
}

export { getLocalData, setLocalData }
