import BrowserId from './browserId'
import request from './request'
import { fetchInfo, getHash } from './fetch'

let defaultUid = '5a096eec830f7876a48aac47'
let bid = ''
let uid = ''
let pid = ''
let auth = null

const sleep = (time) => {
  return new Promise(rev => {
    setTimeout(rev, time)
  })
}

const testCookies = async () => {
  await getHash
  const res = await request('https://biz.caiyunapp.com/test_cookies', { 
    cors: true,
    credentials: 'include',
    headers: {
      'X-Authorization': `token ${fetchInfo.data.cyweb_token}`
    }
  })
  if (res.status === 'ok' && res.cookies.cy_user) {
    const data =  JSON.parse(decodeURIComponent(res.cookies.cy_user))
    uid = data._id || defaultUid
  } else {
    return false
  }
}

const getAuth = () => {
  if (!auth) {
    auth = new Promise((rev, rej) => {
      testCookies().then(async () => {
        if (!uid && !bid) {
          new BrowserId().get(id => bid = id)
          let count = 5
          while (!bid || --count > 0) {
            await sleep(300)
          }
          if (!bid) {
            throw new Error('timeout: get browser id ')
          }
        }
        return request('https://api.interpreter.caiyunai.com/v1/page/auth', {
          cors: true,
          method: 'POST',
          headers: {
            'X-Authorization': `token ${fetchInfo.data.cyweb_token}`,
            'Content-Type': 'application/json'
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
      }).then(res => {
        if (res.auth_type === -1 || !res.page_id) {
          throw new Error('Caiyun api out of limit.')
        } else {
          pid = res.page_id
        }
      }).then(rev).catch(rej)
    })
  }
  return auth
}

const translator = async (list, from = 'ja') => {
  await getAuth()
  await auth
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