import { log } from '../utils/index'

export default async function resourceHook () {
  const originLoadElement = aoba.loaders.Resource.prototype._loadElement
  aoba.loaders.Resource.prototype._loadElement = function (type) {
    // if (type === 'image' && this.url.includes('8f5a4652a6d1d7a160fa5')) {
    //   log(this.url, this.name)
    // }
    // if (this.name === 'images/ui/common/parts_buttons.json_image') {
    //   this.url = 'https://biuuu.github.io/ShinyColors/data/123.png'
    //   this.crossOrigin = true
    // }
    return originLoadElement.call(this, type)
  }
}