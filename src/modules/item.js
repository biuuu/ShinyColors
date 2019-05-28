import getItem from '../store/item'
import tagText from '../utils/tagText'

const userItemTypes = [
  'userRecoveryItems',
  'userProduceItems',
  'userExchangeItems',
  'userLotteryTickets',
  'userEvolutionItems',
  'userGashaTickets',
  'userScoutTickets',
  'userEnhancementItems'
]

const itemTypes = [
  'produceItem',
  'recoveryItem',
  'exchangeItem',
  'lotteryTicket',
  'evolutionItem',
  'gashaTicket',
  'scoutTicket',
  'enhancementItem'
]

const transItem = (item, key, { itemMap, itemLimitMap }) => {
  let text = item[key]
  let limit = ''
  if (/[\r\n]{1,2}\[[^\]]+\]$/.test(text)) {
    let rgs = text.match(/([\s\S]+)[\r\n]{1,2}(\[[^\]]+\])$/)
    if (rgs && rgs[1]) {
      text = rgs[1]
      if (itemLimitMap.has(rgs[2])) {
        limit = itemLimitMap.get(rgs[2])
      }
    }
  }
  let trans = text
  text = text.replace(/\r?\n|\r/g, '\\n')
  if (itemMap.has(text)) {
    trans = itemMap.get(text)
    if (limit) {
      trans += `\n${limit}`
    }
    item[key] = tagText(trans)
  }
}

const transShopItem = async (data) => {
  const maps = await getItem()
  if (data && Array.isArray(data.userShops)) {
    data.userShops.forEach(shop => {
      if (shop && shop.shopMerchandises) {
        shop.shopMerchandises.forEach(item => {
          transItem(item, 'title', maps)
          transItem(item, 'comment', maps)
        })
      }
    })
  }
}

const transUserItem = async (data) => {
  const maps = await getItem()
  if (Array.isArray(data)) {
    data.forEach(obj => {
      itemTypes.forEach(key => {
        const item = obj[key]
        transItem(item, 'name', maps)
        transItem(item, 'comment', maps)
      })
    })
  }
}

export { transShopItem, transUserItem, userItemTypes }
