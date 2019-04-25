import EventEmitter  from 'events'
import config from '../config'

const { origin } = config
let ee = new EventEmitter()
let proxyWin

let loadIframe = () => {
  return new Promise((rev, rej) => {
    window.addEventListener('load', () => {
      const iframe = document.createElement('iframe')
      iframe.src = `${origin}/proxy.html`
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
      proxyWin = iframe.contentWindow
    })
    let timer = setTimeout(() => {
      rej(`加载iframe超时`)
    }, config.timeout * 1000)
    ee.once('loaded', () => {
      clearTimeout(timer)
      rev()
    })
  })
}

let iframeLoaded = false
const fetchData = async (pathname) => {
  const url = pathname
  const flag = Math.random()
  try {
    if (!iframeLoaded) {
      loadIframe = loadIframe()
      iframeLoaded = true
    }
    await loadIframe
    proxyWin.postMessage({
      type: 'fetch',
      url, flag
    }, origin)
  } catch (e) {
    return ''
  }
  return new Promise((rev, rej) => {
    let timer = setTimeout(() => {
      rej(`加载${pathname}超时`)
    }, config.timeout * 1000)
    ee.once(`response${flag}`, function (data) {
      clearTimeout(timer)
      if (data.error) {
        rej(data.error)
      } else {
        rev(data.data)
      }
    })
  })
}

let fetchInfo = {
  status: 'init',
  result: false,
  data: null
}
const tryFetch = async () => {
  if (window.fetch) {
    // if (sessionStorage.getItem('sczh:cors') === 'disabled') {
    //   fetchInfo.status = 'finished'
    //   return
    // }
    try {
      const res = await fetch(`${origin}/manifest.json`)
      const data = await res.json()
      fetchInfo.data = data
      fetchInfo.result = true
      sessionStorage.setItem('sczh:cors', 'enabled')
    } catch (e) {
      sessionStorage.setItem('sczh:cors', 'disabled')
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
        if (type.includes('json')) {
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
        rev(fetchInfo.data.hash)
      } else {
        fetchData('/manifest.json').then(data => {
          beforeStart(data)
          rev(data.hash)
        })
      }
    }).catch(rej)
  } else {
    rev(fetchInfo.data.hash)
  }
})

const fetchWithHash = async (pathname) => {
  const hash = await getHash
  const data = await request(`${pathname}?v=${hash}`)
  return data
}

const receiveMessage = (event) => {
  if (event.origin !== origin) return
  if (event.data && event.data.type) {
    if (event.data.type === 'response') {
      ee.emit(`response${event.data.flag}`, event.data)
    } else if (event.data.type === 'loaded') {
      ee.emit('loaded')
    }
  }
}


window.addEventListener("message", receiveMessage, false)

export default fetchWithHash
export { getHash }
