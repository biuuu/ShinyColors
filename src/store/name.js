import { commonStore } from './index'

const getName = commonStore({
  name: 'name',
  keys: {
    text: 'name',
    trans: 'trans'
  }
})

export default getName
