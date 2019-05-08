import { getHash } from './fetch'
import config from '../config'

const preload = (src) => {
  const link = document.createElement('link')
  link.setAttribute('rel', 'preload')
  link.setAttribute('href', src)
  link.setAttribute('as', 'font')
  link.setAttribute('type', 'font/woff2')
  link.setAttribute('crossorigin', 'anonymous')
  document.head.appendChild(link)
}

const addFont = async () => {
  const tag = document.createElement('style')
  const hash = await getHash
  tag.innerHTML = `
  @font-face {
    font-family: "sczh-heiti";
    src: url("${config.origin}/data/font/heiti.woff2?v=${hash}");
  }
  @font-face {
    font-family: "sczh-yuanti";
    src: url("${config.origin}/data/font/yuanti.woff2?v=${hash}");
  }
  `
  preload(`${config.origin}/data/font/heiti.woff2?v=${hash}`)
  preload(`${config.origin}/data/font/yuanti.woff2?v=${hash}`)

  document.head.appendChild(tag)
}

export default addFont
