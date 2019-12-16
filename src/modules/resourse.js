import { log } from '../utils/index'
import getImage from '../store/image'
import config from '../config'
import { getAoba } from './get-module'

let imageDataPrms = null
const ensureImage = async () => {
  if (!imageDataPrms) {
    imageDataPrms = getImage()
  }
  return await imageDataPrms
}

let replaced = false
export default async function resourceHook () {
  let aoba = await getAoba()
  if (!aoba || replaced) return
  const originLoadElement = aoba.loaders.Resource.prototype._loadElement
  aoba.loaders.Resource.prototype._loadElement = async function (type) {
    if (DEV && type === 'image' && this.url.includes('bc86b91f4f40a00be6c149478bb5f370')) {
      log(this.url, this.name)
    }
    try {
      const imageMap = await ensureImage()
      if (type === 'image' && imageMap.has(this.name)) {
        const data = imageMap.get(this.name)
        if (this.url.endsWith(`v=${data.version}`)) {
          this.url = `${config.origin}/data/image/${data.url}?V=${config.hash}`
          this.crossOrigin = true
        } else {
          log('%cimage version not match', 'color:#fc4175')
          log(this.name, this.url)
        }
      }
    } catch (e) {

    }
    return originLoadElement.call(this, type)
  }
  replaced = true
}
