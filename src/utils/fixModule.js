const fixModule = (param = {}) => {
  let source = ["var n=window.csobb3pncbpccs;", "Object.freeze({addHeader:"]
  let result = ["var n=window.csobb3pncbpccs;window._require=t;", "({addHeader:"]
  
  if (param.source) source = param.source
  if (param.result) result = param.result

  const win = window.unsafeWindow || window

  win.eval = new Proxy(win.eval, {
    apply(target, context, args) {
      for (let i = 0; i < source.length; i++) {
        if (args[0] && args[0].includes(source[i])) {
          args[0] = args[0].replace(source[i], result[i])
        }
      }
      return Reflect.apply(target, context, args)
    }
  })

  win.eval.toString = () => 'function eval() { [native code] }'
}

export default fixModule