const win = window.unsafeWindow || window

win.eval = new Proxy(win.eval, {
  apply(target, _this, [code]) {
    if (code.includes('var n=window.primJsp;')) {
      code = code.replace(
        'var n=window.primJsp;',
        'var n=window.primJsp;window._require=t;'
      )
    }
    return Reflect.apply(target, _this, [code])
  }
})

win.eval.toString = () => 'function eval() { [native code] }'