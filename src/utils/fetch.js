import config from '../config'

const { origin } = config

const saveManifest = async () => {
  const t = Math.floor(Date.now() / 1000 / 60 / 60 / 6)
  const res = await fetch(`${origin}/manifest.json?t=${t}`)
  if (res.ok) {
    const data = await res.json()
    data.time = Date.now()
    localStorage.setItem('sczh:manifest', JSON.stringify(data))
    return data
  } else {
    throw new Error(`${res.status} ${res.url}`)
  }
}

const getManifest = async () => {
  let data
  try {
    let str = localStorage.getItem('sczh:manifest')
    if (str) data = JSON.parse(str)
    if (Date.now() - data.time > config.cacheTime * 60 * 1000) data = false
  } catch (e) {}
  if (!data) {
    data = await saveManifest()
  } else {
    setTimeout(saveManifest, 5 * 1000)
  }
  return data
}

let fetchInfo = {
  data: null
}

const request = async (pathname) => {
  return new Promise((rev, rej) => {
    let timer = setTimeout(() => {
      rej(`加载${pathname}超时`)
    }, config.timeout * 1000)
    fetch(`${origin}${pathname}`)
    .then(res => {
      clearTimeout(timer)
      if (!res.ok) {
        rej(`${res.status} ${res.url}`)
        return ''
      }
      const type = res.headers.get('content-type')
      if (type && type.includes('json')) {
        return res.json()
      }
      return res.text()
    }).then(rev).catch(rej)
  })
}

const getHash = new Promise((rev, rej) => {
  getManifest().then(data => {
    fetchInfo.data = data
    config.newVersion = data.version
    config.hashes = data.hashes
    rev(data)
  }).catch(rej)
})

const fetchWithHash = async (pathname, hash) => {
  if (!hash) {
    const { hashes } = await getHash
    const key = pathname.replace(/^\/(data\/)?/, '')
    hash = hashes[key]
  }
  const data = await request(`${pathname}${hash ? `?v=${hash}` : ''}`)
  return data
}

export default fetchWithHash
export { getHash, fetchInfo }
