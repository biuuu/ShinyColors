import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import getCommMap from '../store/commText'
import { FONT } from '../config'

const replaceFont = (option) => {
  if (isObject(option)) {
    if (option.fontFamily === FONT.HEITI_JA) {
      option.fontFamily = FONT.HEITI_TRANS
    } else if (option.fontFamily === FONT.YUAN_JA) {
      option.fontFamily = FONT.YUAN_TRANS
    }
  }
}

const restoreFont = (option) => {
  if (isObject(option)) {
    if (option.fontFamily === FONT.HEITI_TRANS) {
      option.fontFamily = FONT.HEITI_JA
    } else if (option.fontFamily === FONT.YUAN_TRANS) {
      option.fontFamily = FONT.YUAN_JA
    }
  }
}

export default async function watchText () {
  if (!GLOBAL.aoba) return
  const commMap = await getCommMap()

  const Text = new Proxy(aoba.Text, {
    construct (target, args, newTarget) {
      const text = args[0]
      const option = args[1]
      if (text && isString(text)) {
        //GLOBAL.console.log(...args)
        if (text.startsWith('\u200b\u200b')) {
          // 是被替换过的文本
          args[0] = text.slice(1)
          replaceFont(option)
        } else if (text.trim()) {
          if (commMap.has(text)) {
            args[0] = commMap.get(text)
            replaceFont(option)
          } else if (!text.startsWith('\u200b')) {
            restoreFont(option)
          }
        }
      }
      return Reflect.construct(target, args, newTarget)
    }
  })

  // watch typeText
  const originTypeText = aoba.Text.prototype.typeText
  aoba.Text.prototype.typeText = function (...args) {
    ENVIRONMENT === 'development' && console.log('type text', ...args)
    return originTypeText.apply(this, args)
  }

  // watch drawLetterSpacing
  // const originDrawLetter = aoba.Text.prototype.drawLetterSpacing
  // aoba.Text.prototype.drawLetterSpacing = function (...args) {
  //   console.log('draw letter', ...args)
  //   return originDrawLetter.apply(this, args)
  // }

  GLOBAL.aoba = new Proxy(aoba, {
    get (target, name, receiver) {
      if (name === 'Text') {
        return Text
      }
      return Reflect.get(target, name, receiver)
    }
  })
}
