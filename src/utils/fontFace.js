import { getHash } from './fetch'
import config from '../config'

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
  document.head.appendChild(tag)
}

export default addFont
