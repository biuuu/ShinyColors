import transApi from './api-comm'

const { api, transItem } = transApi('etc/idol-filter')

const transLabel = (data) => {
  const keys = ['activeSkills', 'ideas', 'idolArrivalTypes', 'knowHowBooks', 'supportSkillAttributes', 'supportSkillEffects']
  keys.forEach(key => {
    data[key]?.forEach(item => {
      transItem(item, 'label')
    })
  })
}

const filterOptions = (data) => {
  data.businesses?.forEach(item => {
    transItem(item, 'name')
  })
  data.units?.forEach(item => {
    transItem(item, 'name')
  })
  data.produces?.forEach(item => {
    transItem(item, 'title')
  })
  data.characters?.forEach(item => {
    transItem(item, 'name')
    transItem(item, 'firstName')
    transItem(item.unit, 'name')
  })
  transLabel(data)
}

api.get([
  ['searchPopupContents', filterOptions]
])