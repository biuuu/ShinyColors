import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import getCommMap from '../store/commText'

export default async function watchText () {
  if (!GLOBAL.aoba) return
  const commMap = await getCommMap()
  const Text = new Proxy(aoba.Text, {
    construct (target, args, newTarget) {
      const text = args[0]
      const option = option
      if (text && isString(text)) {
        GLOBAL.console.log(...args)
        if (text.startsWith('\u200b')) {
          // 是被替换过的文本
          args[0] = text.slice(1)
          if (isObject(option)) {
            if (option.fontFamily === '1') {
              args[1].fontFamily = 'FZLanTingHeiS-DB-GB'
            } else if (option.fontFamily === '2') {
              args[1].fontFamily = 'FZCuYuanSongS-R-GB'
            }
          }
        } else if (text.trim()) {
          if (commMap.has(text)) {
            args[0] = commMap.get(text)
          }
        }
      }
      return Reflect.construct(target, args, newTarget)
    }
  })

  // watch typeText
  const originTypeText = aoba.Text.prototype.typeText
  aoba.Text.prototype.typeText = function (...args) {
    console.log('type text', ...args)
    return originTypeText.apply(this, args)
  }

  GLOBAL.aoba = new Proxy(aoba, {
    get (target, name, receiver) {
      if (name === 'Text') {
        return Text
      }
      return Reflect.get(target, name, receiver)
    }
  })
}
