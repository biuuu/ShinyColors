export default function (data) {
  const normal = []
  const sr = []
  data.forEach(item => {
    if (item.buttonImage === 'normal_gasha_button') {
      item.contents.forEach(cont => {
        normal.push({
          name: cont.contentName,
          rate: cont.rate
        })
      })
    } else if (item.buttonImage === 'sr_up_button') {
      item.contents.forEach(cont => {
        sr.push({
          name: cont.contentName,
          rate: cont.rate
        })
      })
    }
  })
  fetch('http://127.0.0.1:8032/imsccard', {
    body: JSON.stringify({ type: 'normal', text: JSON.stringify(normal) }),
    method: 'post',
    mode: 'cors',
    headers: {
      'content-type': 'application/json'
    }
  })
  fetch('http://127.0.0.1:8032/imsccard', {
    body: JSON.stringify({ type: 'sr', text: JSON.stringify(sr) }),
    method: 'post',
    mode: 'cors',
    headers: {
      'content-type': 'application/json'
    }
  })
}
