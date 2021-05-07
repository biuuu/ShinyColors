import { commonStore } from './index'

const getNounFix = commonStore({
  name: 'noun-fix',
  path: 'etc/noun-fix',
  keys: {
    trans: 'fixed'
  },
  sort: 'text',
  ignoreTrans: true
})

const getCaiyunPrefix = commonStore({
  name: 'caiyun-prefix',
  path: 'etc/caiyun-prefix',
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
