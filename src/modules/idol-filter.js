import transApi from './api-comm'

const { api, transItem, ensureData } = transApi('etc/idol-filter')

export const ensureIdolFilter = ensureData

export const someSupportSkillName = (item) => {
  const name = item.name
  if (name.includes('マスタリー') && !name.endsWith('マスタリー')) {
    const suffix = name.replace(/.+マスタリー/, '')
    const keyword = name.replace(suffix, '')
    const temp = { keyword }
    transItem(temp, 'keyword')
    item.name = temp.keyword + suffix
  } else {
    transItem(item, 'name')
  }
}

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