import fetchData from '../utils/fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './index'
import { trim } from '../utils/index'
import sortWords from '../utils/sortWords'

const nounFixMap = new Map()
let nfLoaded = false

const getNounFix = async () => {
  if (!nfLoaded) {
    let csv = await getLocalData('noun-fix')
    if (!csv) {
      csv = await fetchData('/data/etc/noun-fix.csv')
      setLocalData('noun-fix', csv)
    }
    const list = parseCsv(csv)
    sortWords(list, 'text').forEach(item => {
      const text = trim(item.text)
      const fixed = trim(item.fixed)
      if (text) {
        nounFixMap.set(text, fixed)
      }
    })
    nfLoaded = true
  }

  return nounFixMap
}

const cyPrefixMap = new Map()
let cyfLoaded = false

const getCaiyunPrefix = async () => {
  if (!cyfLoaded) {
    let csv = await getLocalData('caiyun-prefix')
    if (!csv) {
      csv = await fetchData('/data/etc/caiyun-prefix.csv')
      setLocalData('caiyun-prefix', csv)
    }
    const list = parseCsv(csv)
    sortWords(list, 'text').forEach(item => {
      const text = trim(item.text)
      const fixed = trim(item.fixed)
      if (text) {
        cyPrefixMap.set(text, fixed)
      }
    })
    cyfLoaded = true
  }

  return cyPrefixMap
}

const getTextFix = async () => {
  await getNounFix()
  await getCaiyunPrefix()
  return { cyPrefixMap, nounFixMap }
}

export { getNounFix, getCaiyunPrefix }
export default getTextFix
