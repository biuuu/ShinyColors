import { fixWrap } from '../../utils/index'

export const getTextTrans = (getId, storyMap, commMap, item) => {
  const id = getId(item.id)
  const text = fixWrap(item.text)
  let result = ''
  if (id && storyMap.has(`${id}`)) {
    result = storyMap.get(`${id}`)
  } else if (storyMap.has(text)) {
    result = storyMap.get(text)
  } else if (commMap.has(text)) {
    result = commMap.get(text)
  }
  return result
}

export const getSelectTrans = (storyMap, commMap, item) => {
  const select = fixWrap(item.select)
  const sKey = `${select}-select`
  let result = ''
  if (storyMap.has(sKey)) {
    result = storyMap.get(sKey)
  } else if (commMap.has(select)) {
    result = commMap.get(item.select)
  }
  return result
}