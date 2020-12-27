let win = (window.unsafeWindow || window)
const th = 640
const tw = 1136

const resize = () => {
  let ih = win.outerHeight
  let iw = win.outerWidth
  const h = document.body.clientHeight
  const w = document.body.clientWidth
  const oh = th - h
  const ow = tw - w
  if (oh || ow) {
    ih += oh
    iw += ow
    win.resizeTo(iw, ih)
  }
}

const autoResize = (count) => {
  count--
  resize()
  if (count > 0) {
    setTimeout(() => autoResize(count), 1000)
  }
}

export default autoResize