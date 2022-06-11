const tag = document.createElement('script')
tag.textContent = `const originFreeze = Object.freeze

Object.freeze = new Proxy(originFreeze, {
  apply (target, self, [data]) {
    return data
  }
})`

;(document.head || document.documentElement).appendChild(tag)