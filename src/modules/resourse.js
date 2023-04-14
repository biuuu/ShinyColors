import { log, log2 } from '../utils/index'
import getImage from '../store/image'
import { getPictureMap } from '../store/picture'
import config from '../config'
import { getModule } from './get-module'
import replaceComic from './comic'

let imageDataPrms = null
const ensureImage = async () => {
  if (!imageDataPrms) {
    imageDataPrms = getImage()
  }
  return await imageDataPrms
}

let resName = ''
const getLocalResName = () => {
  try {
    resName = sessionStorage.getItem('sczh:res-name')
  } catch (e) {}
}

getLocalResName()

const setLocalResName = (name) => {
  try {
    sessionStorage.setItem('sczh:res-name', name)
  } catch (e) {}
}
let win = (window.unsafeWindow || window)
win.queryImageName = setLocalResName

let replaced = false
export default async function resourceHook () {
  const aoba = await getModule('AOBA')
  const { isSupportedWebP, toWebPUrl } = await getModule('WEBP')
  const pictureMap = await getPictureMap()
  if (replaced) return
  aoba.loaders.Resource.prototype = Object.assign({}, aoba.loaders.Resource.prototype)
  const originLoadElement = aoba.loaders.Resource.prototype._loadElement
  aoba.loaders.Resource.prototype._loadElement = async function (type) {
    if (config.dev && type === 'image' && resName && this.url.includes(resName)) {
      log2('%c查询到的图片：', 'color:#66ccff')
      log2(this.url, this.name)
    }
    try {
      const imageMap = await ensureImage()
      if (type === 'image') {
        if (imageMap.has(this.name)) {
          const data = imageMap.get(this.name)
          if (this.url.endsWith(`v=${data.version}`)) {
            const imageKey = `image/${data.url}`
            let imagePath = imageKey
            if (isSupportedWebP() && !imagePath.startsWith('tips/')) {
              imagePath = toWebPUrl(imagePath)
            }
            this.url = `${config.origin}/data/${imagePath}?v=${config.hashes[imageKey]}`
            this.crossOrigin = true
          } else {
            log(this.name, this.url)
          }
        } else if (pictureMap.has(this.name?.replace('images/', ''))) {
          this.url = `${config.origin}/data/${this.name.replace('images/', 'picture/')}?v=${pictureMap.get(this.name.replace('images/', ''))}`
          this.crossOrigin = true
        }
        await replaceComic(this)
      }
    } catch (e) {
      log(e)
    }
    return originLoadElement.call(this, type)
  }
  replaced = true
}
