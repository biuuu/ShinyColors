export default function (data) {
  const names = []
  data.forEach(item => {
    if (item.buttonImage === 'normal_gasha_button') {
      item.contents.forEach(cont => {
        names.push(cont.contentName)
      })
    }
  })
  console.log(names.join('\n'))
}
