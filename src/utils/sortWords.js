const sortWords = (list, key = 'EMPTY') => {
  return list.sort((prev, next) => {
    let valPrev = prev
    let valNext = next
    if (key !== 'EMPTY') {
      valPrev = prev[key]
      valNext = next[key]
    }
    if (!valNext) valNext = ''
    if (!valPrev) valPrev = ''
    if (valNext.length > valPrev.length) {
      return 1
    } else if (valPrev.length > valNext.length) {
      return -1
    } else {
      return 0
    }
  })
}

export default sortWords
