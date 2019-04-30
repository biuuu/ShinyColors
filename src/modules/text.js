import isString from 'lodash/isString'
import getCommMap from '../store/commText'
import { FONT } from '../config'
import { log } from '../utils/index'

const replaceFont = (style) => {
  if (style && style.fontFamily) {
    if (style.fontFamily === FONT.HEITI_JA) {
      Reflect.set(style, 'fontFamily', FONT.HEITI_TRANS)
    } else if (style.fontFamily === FONT.YUAN_JA) {
      Reflect.set(style, 'fontFamily', FONT.YUAN_TRANS)
    }
  }
}

const restoreFont = (style) => {
  if (style && style.fontFamily) {
    if (style.fontFamily === FONT.HEITI_TRANS) {
      Reflect.set(style, 'fontFamily', FONT.HEITI_JA)
    } else if (style.fontFamily === FONT.YUAN_TRANS) {
      Reflect.set(style, 'fontFamily', FONT.YUAN_JA)
    }
  }
}

const fontCheck = (text, style, textMap) => {
  if (!isString(text)) return text
  let _text = text
  if (text.startsWith('\u200b\u200b')) {
    // 是被替换过的文本
    _text = text.slice(1)
    replaceFont(style)
  } else if (text.trim()) {
    if (textMap.has(text)) {
      _text = '\u200b' + textMap.get(text)
      replaceFont(style)
    } else if (!text.startsWith('\u200b')) {
      restoreFont(style)
    }
  }
  return _text
}

export default async function watchText () {
  if (!GLOBAL.aoba) return
  const commMap = await getCommMap()

  const Text = new Proxy(aoba.Text, {
    construct (target, args, newTarget) {
      const text = args[0]
      const option = args[1]
      // log('new text', ...args)
      args[0] = fontCheck(text, option, commMap)
      return Reflect.construct(target, args, newTarget)
    }
  })

  // watch typeText
  const originTypeText = aoba.Text.prototype.typeText
  aoba.Text.prototype.typeText = function (...args) {
    const text = args[0]
    log('type text', ...args)
    args[0] = fontCheck(text, this.style, commMap)
    return originTypeText.apply(this, args)
  }

  const originUpdateText = aoba.Text.prototype.updateText
  aoba.Text.prototype.updateText = function (t) {
    if (this.localStyleID !== this._style.styleID && (this.dirty = !0,e.styleID),this.dirty || !t) {
      // log('update text', this._text)
      const value = fontCheck(this._text, this._style, commMap)
      Reflect.set(this, '_text', value)
      return originUpdateText.call(this, t)
    }
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
