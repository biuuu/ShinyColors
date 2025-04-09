import debounce from 'lodash/debounce'
import { typewriterEffect } from '.'

const html = `
  <style>
  #sczh-trans-cover {
    color: #575453;
    font-family: HummingStd-E;
    position: absolute;
    transform-origin: left center;
    text-align: left;
    font-size: 18px;
    mix-blend-mode: multiply;
  }
  #sczh-trans-cover.hide {
    display: none;
  }
  </style>
  <div id="sczh-trans-cover" class="hide">
  </div>
  `

let htmlInserted = false

const insertHtml = () => {
  if (!htmlInserted) {
    htmlInserted = true
    document.body.insertAdjacentHTML('beforeend', html)
    const box = document.getElementById('sczh-trans-cover')
    const setToolPos = debounce(() => {
      const pos = [0.202, 0.942]
      const height = window.innerHeight
      const width = window.innerWidth
      const h_w = height / width
      let ch = height
      let cw = width
      let offsetTop = 0
      let offsetLeft = 0
      let scale = 1
      if (h_w > 9 / 16) {
        ch = width * 9 / 16
        offsetTop = (height - ch) / 2
        scale = cw / 1600 * 1.6
      } else {
        cw = height * 16 / 9
        offsetLeft = (width - cw) / 2
        scale = ch / 900 * 1.6
      }
      box.style.left = Math.floor(offsetLeft + pos[0] * cw) + 'px'
      box.style.top = Math.floor(offsetTop + pos[1] * ch) + 'px'
      box.style.maxWidth = Math.floor(0.5 * cw) + 'px'
      box.style.transform = `scale(${scale.toFixed(3)}) translateY(-50%)`
    }, 300)

    setToolPos()

    window.addEventListener('resize', setToolPos)
  }
  return document.getElementById('sczh-trans-cover')
}

const transCover = (text) => {
  const box = insertHtml()
  box.classList.remove('hide')
  typewriterEffect(text, box)
}

export default transCover
