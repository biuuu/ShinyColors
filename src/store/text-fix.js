import { commonStore } from './index'

const getNounFix = commonStore({
  name: 'etc/noun-fix',
  keys: {
    trans: 'fixed'
  },
  sort: 'text',
  ignoreTrans: true
})

const getCaiyunPrefix = commonStore({
  name: 'etc/caiyun-prefix',
  keys: {
    trans: 'fixed'
  },
  sort: 'text',
  ignoreTrans: true
})

const getTextFix = async () => {
  const nounFixMap = await getNounFix()
  const cyPrefixMap = await getCaiyunPrefix()
  return { cyPrefixMap, nounFixMap }
}

export { getNounFix, getCaiyunPrefix }
export default getTextFix
