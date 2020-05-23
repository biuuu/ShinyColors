import qs from 'qs'
import request from './request'
import { fetchInfo } from './fetch'

const getTransResult = (data) => {
  if (data[0]?.length) {
    const result = data[0].map(item => item[0])
    return result.join('').split('\n')
  }
  return []
}

const googleApi = async (keyword) => {
  let to = fetchInfo.data.language || 'zh-CN'
  let query = qs.stringify({
    client: 'gtx',
    sl: 'ja',
    tl: to,
    hl: to,
    ie:'UTF-8',
    oe:'UTF-8'
  })
  ;['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'].forEach(item => {
    query += `&dt=${item}`
  })
  const data = qs.stringify({ q: keyword })
  const res = await request(`https://translate.google.cn/translate_a/single?${query}`, {
    data: data,
    method: 'POST',
    headers: {
      'accept': '*/*',
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'referer': 'https://translate.google.cn',
      'origin':'https://translate.google.cn',
    }
  })
  return getTransResult(res)
}

export default googleApi