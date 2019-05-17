import { log } from '../utils/index'
import getImage from '../store/image'
import config from '../config'

export default async function resourceHook () {
  if (!GLOBAL.aoba) return
  const originLoadElement = aoba.loaders.Resource.prototype._loadElement
  aoba.loaders.Resource.prototype._loadElement = async function (type) {
    if (DEV && type === 'image' && this.url.includes('f0fa3e4bf9feac6c1c8b5cec74d2946bb638')) {
      log(this.url, this.name)
    }
    try {
      const imageMap = await getImage()
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
}
