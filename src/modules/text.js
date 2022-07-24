import getCommMap from '../store/commText'
import { log, fixWrap } from '../utils/index'
import getTypeTextMap from '../store/typeText'
import { getModule } from './get-module'
import config from '../config'

let commMap = new Map()
let typeTextMap = new Map()

const typeTextStack = []
const setTypeText = (text) => {
  typeTextStack.push(text)
  if (config.dev && SHOW_UPDATE_TEXT) log(typeTextStack)
  setTimeout(() => typeTextStack.shift(), 10000)
}

const isTyping = (text) => {
  let typing = false
  typeTextStack.forEach(txt => {
    if (txt.startsWith(text)) {
      typing = true
    }
  })
  return typing
}

const replaceText = (text, map) => {
  let _text = text
  let key = fixWrap(text)
  if (map.has(key)) {
    _text = map.get(key)
  }
  return _text
}

const checkText = (text, isType = false) => {
  if (!typeof text !== 'string') return text
  let _text = text
  if (text.trim()) {
    if (isType) {
      _text = replaceText(text, typeTextMap)
      if (_text === text) {
        setTypeText(text)
      }
    } else if (!isTyping(text) && !text.startsWith('\u200c')) {
      _text = replaceText(text, commMap)
    }
  }
  return _text
}

export default async function watchText () {
  const aoba = await getModule('AOBA')

  try {
    commMap = await getCommMap()
    typeTextMap = await getTypeTextMap()
  } catch (e) {}

  // watch typeText
  const originTypeText = aoba.Text.prototype.typeText
  aoba.Text.prototype.typeText = function (...args) {
    const text = args[0]
    if (SHOW_UPDATE_TEXT) log('type text', ...args)
    args[0] = checkText(text, true)
    return originTypeText.apply(this, args)
  }

  const originUpdateText = aoba.Text.prototype.updateText
  aoba.Text.prototype.updateText = function (t) {
    if (this.localStyleID !== this._style.styleID && (this.dirty = !0,this._style.styleID),this.dirty || !t) {
      if (config.dev && SHOW_UPDATE_TEXT) log('update text', this._text)
      const value = checkText(this._text)
      Reflect.set(this, '_text', value)
      return originUpdateText.call(this, t)
    }
  }
}
