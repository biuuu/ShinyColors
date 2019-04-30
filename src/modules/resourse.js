import { log } from '../utils/index'
import getImage from '../store/image'
import config from '../config'

export default async function resourceHook () {
  if (!GLOBAL.aoba) return
  const imageMap = await getImage()
  const originLoadElement = aoba.loaders.Resource.prototype._loadElement
  aoba.loaders.Resource.prototype._loadElement = function (type) {
    // if (type === 'image' && this.url.includes('697481939646e7371fd37596e0055b26')) {
    //   log(this.url, this.name)
    // }
    if (type === 'image' && imageMap.has(this.name)) {
      this.url = `${config.origin}/data/image/${imageMap.get(this.name)}?V=${config.hash}`
      this.crossOrigin = true
    }
    return originLoadElement.call(this, type)
  }
}
