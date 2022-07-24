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
    font-family: "UDKakugo_SmallPr6-B";
    src: url("${config.origin}${getPath('heiti', hashes)}"),
      url("/assets/fonts/primula-UDKakugo_SmallPr6-B.woff2?v=5b98f6814db5b7ff2e73b0bbbd48ebb3");
  }
  @font-face {
    font-family: "HummingStd-E";
    src: url("${config.origin}${getPath('yuanti', hashes)}"),
      url("/assets/fonts/primula-HummingStd-E.woff2?v=57f0e9684ac32d5ed54c567c001eaaaa");
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

  document.body.appendChild(tag)
}

export default addFont
