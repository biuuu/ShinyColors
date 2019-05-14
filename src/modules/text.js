import isString from 'lodash/isString'
import getCommMap from '../store/commText'
import { FONT } from '../config'
import { log } from '../utils/index'
import getTypeTextMap from '../store/typeText'

let commMap = new Map()
let typeTextMap = new Map()

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

const textInMap = (text, map, style) => {
  let _text = text
  if (map.has(text)) {
    _text = '\u200b' + map.get(text)
    replaceFont(style)
  } else if (!text.startsWith('\u200b')) {
    restoreFont(style)
  }
  return _text
}

const fontCheck = (text, style, isType = false) => {
  if (!isString(text)) return text
  let _text = text
  if (text.startsWith('\u200b')) {
    replaceFont(style)
  } else if (text.trim()) {
    if (isType) {
      _text = textInMap(text, typeTextMap, style)
    } else {
      _text = textInMap(text, commMap, style)
    }
  }
  return _text
}

export default async function watchText () {
  if (!GLOBAL.aoba) return
  commMap = await getCommMap()
  typeTextMap = await getTypeTextMap()

  const Text = new Proxy(aoba.Text, {
    construct (target, args, newTarget) {
      const text = args[0]
      const option = args[1]
      if (SHOW_UPDATE_TEXT) log('new text', ...args)
      args[0] = fontCheck(text, option)
      return Reflect.construct(target, args, newTarget)
    }
  })

  // watch typeText
  const originTypeText = aoba.Text.prototype.typeText
  aoba.Text.prototype.typeText = function (...args) {
    const text = args[0]
    if (SHOW_UPDATE_TEXT) log('type text', ...args)
    args[0] = fontCheck(text, this.style, true)
    return originTypeText.apply(this, args)
  }

  const originUpdateText = aoba.Text.prototype.updateText
  aoba.Text.prototype.updateText = function (t) {
    if (this.localStyleID !== this._style.styleID && (this.dirty = !0,this._style.styleID),this.dirty || !t) {
      if (DEV && SHOW_UPDATE_TEXT) log('update text', this._text)
      const value = fontCheck(this._text, this._style)
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
