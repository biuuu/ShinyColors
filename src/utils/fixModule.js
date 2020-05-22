const fixModule = (param = {}) => {
  let source = 'var n=window.csobb3pncbpccs;'
  let result = 'var n=window.csobb3pncbpccs;window._require=t;'
  if (param.source) source = param.source
  if (param.result) result = param.result

  const win = window.unsafeWindow || window

  win.eval = new Proxy(win.eval, {
    apply(target, context, args) {
      if (args[0] && args[0].includes(source)) {
        args[0] = args[0].replace(source, result)
      }
      return Reflect.apply(target, context, args)
    }
  })

  win.eval.toString = () => 'function eval() { [native code] }'
}

export default fixModule