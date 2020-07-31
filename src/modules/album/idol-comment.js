import { transText } from '../type-text'

const gashaDrawComment = async (data) => {
  const list = []
  data.gashaDraws?.forEach(item => {
    if (item.comment) {
      list.push(item.comment)
    }
  })
  await transText(list)
}

const gashaReDrawComment = async (data) => {
  const list = []
  data.forEach(item => {
    if (item.comment) {
      list.push(item.comment)
    }
  })
  await transText(list)
}

const idolComment = async (data) => {
  const list = []
  data.produceIdols.forEach(item => {
    if (item.comment) {
      list.push(item.comment)
    }
  })
  await transText(list)
}

export { gashaDrawComment, gashaReDrawComment, idolComment }