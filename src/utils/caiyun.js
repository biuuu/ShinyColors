import request from './request'
import { fetchInfo } from './fetch'
import x64hash128 from './x64hash128'

let bid = ''
let uid = ''
let pid = ''
let limited = false

const setBid = () => {
  let str = '0123456789abcdefghijklmnopqrstuvwxyz'
  let text = ''
  for (let i = 0; i < 33; i++) {
    text += str[Math.floor(Math.random() * str.length)]
  }
  bid = x64hash128(text, 31)
  localStorage.setItem('sczh:bid', bid)
}

try {
  bid = localStorage.getItem('sczh:bid')
} catch (e) {}

if (!bid) {
  setBid()
}

const getAuth = async () => {
  const res = await request('https://api.interpreter.caiyunai.com/v1/page/auth', {
    // cors: true,
    method: 'POST',
    headers: {
      'X-Authorization': `token ${fetchInfo.data.cyweb_token}`,
      'Content-Type': 'application/json',
      'origin': 'https://fanyi.caiyunapp.com',
      'referer': 'https://fanyi.caiyunapp.com/'
    },
    data: JSON.stringify({
      browser_id: bid,
      device_id: '',
      os_type: 'web',
      title: document.title,
      url: document.URL,
      user_id: uid
    })
  })
  if (res.auth_type === -1 || !res.page_id) {
    limited = true
    setBid()
  } else {
    limited = false
    pid = res.page_id
  }
}

const translator = async (list, from = 'ja') => {
  await getAuth()
  if (limited) {
    return []
  }
  const res = await request('https://api.interpreter.caiyunai.com/v1/page/translator', {
    cors: true,
    method: 'POST',
    headers: {
      'X-Authorization': `token ${fetchInfo.data.cyweb_token}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      cached: true,
      os_type: 'web',
      page_id: pid,
      replaced: true,
      request_id: bid || uid,
      source: list,
      trans_type: `${from}2zh`,
      url: document.URL
    })
  })
  if (res && res.target) {
    return res.target.map(item => item.target)
  }
  return []
}

export default translator