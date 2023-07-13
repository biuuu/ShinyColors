import request from './request'
import { fetchInfo } from './fetch'
import x64hash128 from './x64hash128'
import { Base64 } from 'js-base64'
import jwt_decode from 'jwt-decode'

let bid = ''
let jwt = ''
let limited = false

const reset = () => {
  let str = '0123456789abcdefghijklmnopqrstuvwxyz'
  let text = ''
  for (let i = 0; i < 33; i++) {
    text += str[Math.floor(Math.random() * str.length)]
  }
  bid = x64hash128(text, 31)
  jwt = ''
  localStorage.setItem('sczh:bid', bid)
  localStorage.setItem('sczh:caiyun-jwt', jwt)
}

function transform (e) {
  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    , i = "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm"
    , a = n=>t.indexOf(n)
    , o = n=>a(n) > -1 ? i[a(n)] : n;
  return e.split("").map(o).join("")
}

const checkJwt = () => {
  try {
    const { exp } = jwt_decode(jwt)
    if (exp * 1000 < Date.now()) {
      jwt = ''
    }
  } catch (e) {}
}

try {
  bid = localStorage.getItem('sczh:bid')
  jwt = localStorage.getItem('sczh:caiyun-jwt')
  checkJwt()
} catch (e) {}

if (!bid) {
  reset()
}

const getAuth = async () => {
  checkJwt()
  if (jwt) return
  const res = await request('https://api.interpreter.caiyunai.com/v1/user/jwt/generate', {
    method: 'POST',
    headers: {
      'X-Authorization': `token:${fetchInfo.data.cyweb_token}`,
      'Content-Type': 'application/json',
      'origin': 'https://fanyi.caiyunapp.com',
      'referer': 'https://fanyi.caiyunapp.com/',
      'Device-Id': bid
    },
    data: JSON.stringify({
      browser_id: bid
    })
  })
  if (!res.jwt) {
    limited = true
    reset()
  } else {
    limited = false
    jwt = res.jwt
    localStorage.setItem('sczh:caiyun-jwt', jwt)
  }
}

const translator = async (list, from = 'ja') => {
  await getAuth()
  if (!jwt) return []
  const res = await request('https://api.interpreter.caiyunai.com/v1/translator', {
    cors: true,
    method: 'POST',
    headers: {
      'X-Authorization': `token:${fetchInfo.data.cyweb_token}`,
      'Content-Type': 'application/json',
      'Device-Id': bid,
      'T-Authorization': jwt
    },
    data: JSON.stringify({
      cached: true,
      os_type: 'web',
      replaced: true,
      request_id: 'web_fanyi',
      source: list,
      trans_type: `${from}2zh`,
      style: 'formal',
      media: 'text',
      dict: true,
      detect: true,
      browser_id: bid
    })
  })
  if (res && res.target) {
    return res.target.map(str => Base64.decode(transform(str)))
  } else {
    reset()
  }
  return []
}

export default translator