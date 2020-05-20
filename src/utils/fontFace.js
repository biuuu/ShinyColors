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

const getPath = (name, hashes) => `/data/font/${name}.woff2?v=${hashes[`font/${name}.woff2`]}`

const addFont = async () => {
  const tag = document.createElement('style')
  const { hashes } = await getHash
  tag.innerHTML = `
  @font-face {
    font-family: "sczh-heiti";
    src: url("${config.origin}${getPath('heiti', hashes)}");
  }
  @font-face {
    font-family: "sczh-yuanti";
    src: url("${config.origin}${getPath('yuanti', hashes)}");
  }
  ::-webkit-scrollbar {
    display: none;
  }
  `
  if (config.font1 === 'yuanti') {
    preload(`${config.origin}${getPath('yuanti', hashes)}`)
  }
  if (config.font2 === 'heiti') {
    preload(`${config.origin}${getPath('heiti', hashes)}`)
  }

  document.head.appendChild(tag)
}

export default addFont
