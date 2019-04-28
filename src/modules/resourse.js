import { log } from '../utils/index'
import getImage from '../store/image'
import config from '../config'

export default async function resourceHook () {
  const imageMap = await getImage()
  const originLoadElement = aoba.loaders.Resource.prototype._loadElement
  aoba.loaders.Resource.prototype._loadElement = function (type) {
    // if (type === 'image' && this.url.includes('8f5a4652a6d1d7a160fa5')) {
    //   log(this.url, this.name)
    // }
    if (imageMap.has(this.name)) {
      this.url = `${config.origin}/data/image/${imageMap.get(this.name)}?V=${config.hash}`
      this.crossOrigin = true
    }
    return originLoadElement.call(this, type)
  }
}
