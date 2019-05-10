import config from '../config'

const { origin } = config

let fetchInfo = {
  status: 'init',
  result: false,
  data: null
}
const tryFetch = async () => {
  if (fetch) {
    try {
      const res = await fetch(`${origin}/manifest.json`)
      const data = await res.json()
      fetchInfo.data = data
      fetchInfo.result = true
    } catch (e) {

    }
  }
  fetchInfo.status = 'finished'
}

const request = async (pathname) => {
  if (fetchInfo.result) {
    return new Promise((rev, rej) => {
      let timer = setTimeout(() => {
        rej(`加载${pathname}超时`)
      }, config.timeout * 1000)
      fetch(`${origin}${pathname}`)
      .then(res => {
        clearTimeout(timer)
        const type = res.headers.get('content-type')
        if (type && type.includes('json')) {
          return res.json()
        }
        return res.text()
      }).then(rev).catch(rej)
    })
  } else {
    return await fetchData(pathname)
  }
}

const getHash = new Promise((rev, rej) => {
  if (fetchInfo.status !== 'finished') {
    tryFetch().then(() => {
      const beforeStart = (data) => {
        config.newVersion = data.version
        config.hash = data.hash
      }
      if (fetchInfo.result) {
        beforeStart(fetchInfo.data)
        rev(fetchInfo.data)
      } else {
        rej('网络错误')
      }
    }).catch(rej)
  } else {
    rev(fetchInfo.data.hash)
  }
})

const fetchWithHash = async (pathname) => {
  const { hash } = await getHash
  const data = await request(`${pathname}?v=${hash}`)
  return data
}

export default fetchWithHash
export { getHash }
