export default function (data) {
  if (!DEV || !COLLECT_CARD_RATE) return
  const normal = []
  const sr = []
  const rarityType = { 2: 'r', 3: 'sr', 4: 'ssr' }
  data.forEach(item => {
    let type = rarityType[item.rarity]
    if (item.buttonImage === 'normal_gasha_button') {
      item.contents.forEach(cont => {
        normal.push({
          name: cont.contentName,
          rate: cont.rate,
          id: cont.contentId,
          type
        })
      })
    } else if (item.buttonImage === 'sr_up_button') {
      item.contents.forEach(cont => {
        sr.push({
          name: cont.contentName,
          rate: cont.rate,
          id: cont.contentId,
          type
        })
      })
    }
  })
  fetch('https://127.0.0.1:8032/imsccard', {
    body: JSON.stringify({ type: 'normal', text: JSON.stringify(normal) }),
    method: 'post',
    mode: 'cors',
    headers: {
      'content-type': 'application/json'
    }
  })
  fetch('https://127.0.0.1:8032/imsccard', {
    body: JSON.stringify({ type: 'sr', text: JSON.stringify(sr) }),
    method: 'post',
    mode: 'cors',
    headers: {
      'content-type': 'application/json'
    }
  })
}
