import debounce from 'lodash/debounce'

const html = `
  <style>
  #sczh-aitrans-hint {
    background-color: #68b631;
    padding: 8px 12px;
    color: white;
    display: block;
    font-family: HummingStd-E;
    position: absolute;
    transform-origin: right bottom;
    box-shadow: 2px 2px 4px #0000003b;
    border-radius: 4px;
    text-shadow: 1px 1px 3px rgb(0 0 0 / 24%);
  }
  #sczh-aitrans-hint.hide {
    display: none;
  }
  </style>
  <div id="sczh-aitrans-hint" class="hide">
  </div>
  `

let htmlInserted = false
let hideTimer
const showAiTransHint = (text) => {
  let box = null
  if (!htmlInserted) {
    htmlInserted = true
    document.body.insertAdjacentHTML('beforeend', html)
    box = document.getElementById('sczh-aitrans-hint')
    const setToolPos = debounce(() => {
      const pos = [0.2, 0.22]
      const height = window.innerHeight
      const width = window.innerWidth
      const h_w = height / width
      let ch = height
      let cw = width
      let offsetTop = 0
      let offsetRight = 0
      let scale = 1
      if (h_w > 9 / 16) {
        ch = width * 9 / 16
        offsetTop = (height - ch) / 2
        scale = cw / 1600 * 1.4
      } else {
        cw = height * 16 / 9
        offsetRight = (width - cw) / 2
        scale = ch / 900 * 1.4
      }
      box.style.right = Math.floor(offsetRight + pos[0] * cw) + 'px'
      box.style.bottom = Math.floor(offsetTop + pos[1] * ch) + 'px'
      box.style.transform = `scale(${scale.toFixed(3)})`
      if (storyCache.name) {
        box.style.display = 'flex'
      } else {
        box.style.display = 'none'
      }
    }, 300)

    setToolPos()

    window.addEventListener('resize', setToolPos)
  }

  box = document.getElementById('sczh-aitrans-hint')
  box.textContent = text

  setTimeout(() => {
    box.classList.remove('hide')
  }, 300)

  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    box.classList.add('hide')
  }, 5000)

}

export default showAiTransHint
