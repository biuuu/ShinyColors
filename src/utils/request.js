const CROSS_DOMAIN_REQ = !!window.GM_xmlhttpRequest

const request = (url, option) => {
  const { method = 'GET', headers, responseType = 'json', data } = option
  if (!CROSS_DOMAIN_REQ) {
    return fetch(url, {
      body: data,
      headers, method,
      mode: 'cors'
    }).then(res => res.json())
  }
  return new Promise((rev, rej) => {
    if (!CROSS_DOMAIN_REQ) {
      return rej('GM_XHR MISSING')
    }
    window.GM_xmlhttpRequest({
      method, url, headers, responseType, data,
      onload ({ status, responseText, statusText }) {
        if (status >= 200 && status < 300) {
          if (responseType === 'json') {
            const obj = JSON.parse(responseText)
            rev(obj)
          } else {
            rev(responseText)
          }
        } else {
          rej(statusText)
        }
      },
      onerror (err) {
        rej(err)
      }
    })
  })
}

export default request
