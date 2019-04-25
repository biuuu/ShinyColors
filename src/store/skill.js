import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trim } from '../utils/index'

const supportSkillMap = new Map()
const nounMap = new Map()
const nounArr = []
let supportLoaded = false

const getSupportSkill = async () => {
  if (!supportLoaded) {
    let csv = await getLocalData('support-skill')
    if (!csv) {
      csv = await fetchData('/data/support-skill.csv')
      setLocalData('support-skill', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      if (item && item.text) {
        const text = trim(item.text)
        const trans = trim(item.trans)
        const type = trim(item.type)
        if (text && trans) {
          if (type === 'noun') {
            nounArr.push(text)
            nounMap.set(text, trans)
          } else {
            supportSkillMap.set(text, trans)
          }
        }
      }
    })
    supportLoaded = true
  }

  const nounRE = `(${nounArr.join('|')})`
  return { skillMap: supportSkillMap, nounMap, nounRE }
}

export { getSupportSkill }
