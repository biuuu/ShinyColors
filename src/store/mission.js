import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trim, pureRE } from '../utils/index'

const textMap = new Map()
const expMap = new Map()
const nounMap = new Map()
const nameMap = new Map()
const noteMap = new Map()
let nounRE = ''
let nameRE = ''
let noteRE = ''
let loaded = false

const getMission = async (full = false) => {
  if (!loaded) {
    let csv = await getLocalData('mission')
    if (!csv) {
      csv = await fetchData('/data/mission-re.csv')
      setLocalData('mission', csv)
    }
    const list = parseCsv(csv)
    const nounArr = []
    const nameArr = []
    const noteArr = []
    list.forEach(item => {
      if (item && item.text) {
        const text = trim(item.text, true)
        const trans = trim(item.trans, true)
        const type = trim(item.type, true)
        if (text && trans) {
          if (type === 'noun') {
            nounArr.push(pureRE(text))
            nounMap.set(text, trans)
          } else if (type === 'note') {
            noteArr.push(pureRE(text))
            noteMap.set(text, trans)
          } else if (type === 'name') {
            nameArr.push(pureRE(text))
            nameMap.set(text, trans)
          } else if (type === 'text') {
            textMap.set(text, trans)
          } else {
            expMap.set(text, trans)
          }
        }
      }
    })
    nounRE = `(${nounArr.join('|')})`
    nameRE = `(${nameArr.join('|')})`
    noteRE = `(${noteArr.join('|')})`

    loaded = true
  }

  return missionMap
}

export default getMission
