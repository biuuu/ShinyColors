const tagText = (text, taged = false) => {
  if (taged && text.startsWith('\u200b')) {
    return text
  }
  return `\u200b${text}`
}

const restoreText = (text) => {
  return text.startsWith('\u200b') ? text.slice(1, text.length) : text
}

export { restoreText }
export default tagText
