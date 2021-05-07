import { log } from '../utils/index'
import getImage from '../store/image'
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

let replaced = false
export default async function resourceHook () {
  const aoba = await getModule('AOBA')
  if (replaced) return
  aoba.loaders.Resource.prototype = Object.assign({}, aoba.loaders.Resource.prototype)
  const originLoadElement = aoba.loaders.Resource.prototype._loadElement
  aoba.loaders.Resource.prototype._loadElement = async function (type) {
    if (config.dev && type === 'image' && RES_NAME && this.url.includes(RES_NAME)) {
      log(this.url, this.name)
    }
    try {
      const imageMap = await ensureImage()
      if (type === 'image') {
        if (imageMap.has(this.name)) {
          const data = imageMap.get(this.name)
          if (this.url.endsWith(`v=${data.version}`)) {
            const imagePath = `image/${data.url}`
            this.url = `${config.origin}/data/${imagePath}?v=${config.hashes[imagePath]}`
            this.crossOrigin = true
          } else {
            log('%cimage version not match', 'color:#fc4175')
            log(this.name, this.url)
          }
        }
        await replaceComic(this)
      }
    } catch (e) {

    }
    return originLoadElement.call(this, type)
  }
  replaced = true
}
