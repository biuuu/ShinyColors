
import { log } from '../utils/index'
import cloneDeep from 'lodash/cloneDeep'
import config from '../config'

const logStyles = color => ([
  `background-color:${color};color:#fff;padding:0 0.3em`,
  '',
  `color:${color};text-decoration:underline`
])

const requestLog = (method, color, args, data) => {
  if (config.dev) {
    let _data = data
    if (data) {
      _data = cloneDeep(data)
    }
    log(`%c${method}%c %c${args[0]}`, ...logStyles(color), args[1] || '', '\n=>', _data)
  }
}

const requestRouter = async (data, type, map) => {
  try {
    for (let [key, params] of map) {
      let pass = false
      if (params.type === 'string' && params.key === type) {
        pass = true
      } else if (params.type === 'regexp' && params.key.test(type)) {
        pass = true
      }
      if (pass) {
        const handles = params.handles
        for (let handle of handles) {
          await handle(data)
        }
      }
    }
  } catch (e) {
    log(e)
  }
}

const parseExp = (str) => {
  const exp = str.replace(/{num}/g, '\\d+')
    .replace(/{uuid}/g, '[a-f\\d]{8}-([a-f\\d]{4}-){3}[a-f\\d]{12}')
  return new RegExp(`^${exp}$`)
}

const routerMaps = {
  get: new Map(), post: new Map(),
  patch: new Map(), put: new Map()
}

const addRouter = (path, handle, map) => {
  if (!map.has(path)) {
    const isRegExp = path.includes('{') || path.includes('(')
    const data = {
      handles: [],
      key: isRegExp ? parseExp(path) : path,
      type: isRegExp ? 'regexp' : 'string'
    }
    map.set(path, data)
  }
  const data = map.get(path)
  if (Array.isArray(handle)) {
    data.handles = data.handles.concat(handle)
  } else {
    data.handles.push(handle)
  }
}

const routerProcess = (paths, handle, map) => {
  if (!Array.isArray(paths)) {
    addRouter(paths, handle, map)
  } else {
    for (let path of paths) {
      addRouter(path, handle, map)
    }
  }
}

const routerOf = (type) => (paths, handle) => {
  const map = routerMaps[type]
  if (!handle) {
    const list = paths
    for (let [_paths, _handle] of list) {
      routerProcess(_paths, _handle, map)
    }
  } else {
    routerProcess(paths, handle, map)
  }
}

const router = {
  get: routerOf('get'),
  post: routerOf('post'),
  patch: routerOf('patch'),
  put: routerOf('put')
}

const methodColor = {
  GET: "#009688",
  PATCH: "#8BC34A",
  POST: "#3F51B5",
  PUT: "#9C27B0"
}

const requestResolver = (method, path, options, resolve) => async (...args) => {
  requestLog(method, methodColor[method], [path], args[0]?.body)
  await requestRouter(args[0]?.body, path, routerMaps[method.toLowerCase()])
  return resolve(...args)
}

const originPush = Array.prototype.push
Array.prototype.push = function (...args) {
    if (typeof args[0]==='object' && args[0]?.method) {
      const { path, method, options, resolve } = args[0]
      args[0].resolve = requestResolver(method.toUpperCase(), path, options, resolve)
    }
    return originPush.apply(this, args)
}

export { requestLog, router }