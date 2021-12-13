import { router } from './request'
import tagText from '../utils/tagText'

let comicMap = null
const getInfo = async () => {
  if (comicMap) return comicMap
  try {
    const res = await fetch(`https://comic.shiny.fun/4ko.json?t=${Math.floor(Date.now() / (1000 * 60 * 60))}`)
    const list = await res.json()
    comicMap = new Map(list)
  } catch (e) {
    comicMap = new Map()
  }
  return comicMap
}

let promiseObj = null
const ensureComicMap = () => {
  if (promiseObj) return promiseObj
  promiseObj = getInfo()
  return promiseObj
}

const replaceComic = async function (self) {
  if (/^images\/content\/comics\/(web|limited|special)\/page\/[^_]+_\d+\.jpg/.test(self.name)) {
    const id = parseInt(self.name.match(/page\/[^_]+_(\d+)\.jpg/)[1])
    await ensureComicMap()
    if (comicMap.has(id)) {
      self.url = `https://comic.shiny.fun/4ko/${comicMap.get(id).name}`
      self.crossOrigin = true
    }
  }
}

const transComicTitle = async (data) => {
  await ensureComicMap()
  data.comics.forEach(item => {
    const id = parseInt(item.id)
    if (comicMap.has(id)) {
      const title = comicMap.get(id).title
      if (title) {
        item.title = tagText(title)
      }
    }
  })
}

router.get([
  [['comics'], transComicTitle]
])

export default replaceComic