import transApi from '../api-comm'

const { api, transItem } = transApi('etc/idea-note')

const commSkill = (data) => {
  transItem(data, 'title')
  transItem(data, 'comment')
}

const transNote = (note) => {
  if (!note) return
  transItem(note, 'title')
  commSkill(note.produceIdeaNoteCompleteBonus)
  note.produceIdeaNoteExtraBonuses?.forEach(item => {
    transItem(item, 'comment')
    transItem(item, 'condition')
  })
}

const ideaNotesSkill = (data) => {
  data.userProduceIdeaNotes?.forEach(item => {
    transNote(item.produceIdeaNote)
  })
}

const noteResultSkill = (data) => {
  data.produceEvents?.forEach(item => {
    item.produceIdeaNotes?.forEach(note => {
      transNote(note)
    })
  })
  let note = data.lessonResult?.userProduceIdeaNote?.produceIdeaNote
  transNote(note)
}

const userProduceIdeaNotes = (data) => {
  data.forEach(item => {
    transNote(item.produceIdeaNote)
  })
}

const produceEndWeek = (data) => {
  data.ideaNoteResult?.seasonClearBonusIdeaNotes?.forEach(note => {
    transNote(note)
  })
}

const patchIdeaNote = (data) => {
  transNote(data.userProduceIdeaNote.produceIdeaNote)
}

api.get([
  ['userProduceIdeaNotes', userProduceIdeaNotes]
])

api.post([
  ['produces/actions/(resume|next)', [ideaNotesSkill, produceEndWeek]],
  ['produces/actions/act', [noteResultSkill]],
  ['produces/actions/endWeek', produceEndWeek]
])

api.patch([
  ['userProduceIdeaNotes/228681479/actions/select', patchIdeaNote]
])