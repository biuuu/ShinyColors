import getItem from '../store/item'
import tagText from '../utils/tagText'
import { fixWrap, replaceWrap, log } from '../utils/'

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

let itemPrms
const ensureItem = async () => {
  if (!itemPrms) {
    itemPrms = getItem()
  }
  return await itemPrms
}

let unknownItems = []
const collectItems = (text) => {
  if (!text) return
  let _text = replaceWrap(text)
  if (!unknownItems.includes(_text)) {
    unknownItems.push(_text)
  }
}

let win = (window.unsafeWindow || window)
win.printUnknowItems = () => log(unknownItems.join('\n'))

const transItem = (item, key, { itemMap, itemLimitMap, itemNoteMap }) => {
  if (!item || typeof item[key] !== 'string') return
  let text = fixWrap(item[key])
  let limit = ''
  let note = ''
  let exp = ''
  if (/[\s\S]+[\r\n]{0,2}\[[^\]]+\]$/.test(text)) {
    let rgs = text.match(/([\s\S]+)([\r\n]{0,2}\[[^\]]+\])$/)
    text = rgs[1].trim()
    let txt = rgs[2]
    if (itemLimitMap.has(txt)) {
      limit = itemLimitMap.get(txt)
    } else {
      limit = txt
    }
  }

  if (/[\s\S]+[\r\n]{0,2}【Exp:\d+】$/.test(text)) {
    let rgs = text.match(/([\s\S]+)([\r\n]{0,2}【Exp:\d+】)$/)
    text = rgs[1].trim()
    exp = rgs[2]
  }

  if (/[\s\S]+[\r\n]{0,2}[(（][^)）]+[）)]$/.test(text)) {
    let rgs = text.match(/([\s\S]+)([\r\n]{0,2})[(（]([^)）]+)[）)]$/)
    text = rgs[1].trim()
    let txt = rgs[3]
    if (itemNoteMap.has(txt)) {
      note = `${rgs[2]}（${itemNoteMap.get(txt)}）`
    } else {
      note = `${rgs[2]}（txt）`
    }
  }

  if (itemMap.has(text)) {
    let trans = itemMap.get(text)
    trans = `${trans}${note}${exp}${limit}`
    item[key] = tagText(trans)
  } else if (DEV) {
    collectItems(item[key])
  }
}

const switchShop = (shop, maps) => {
  if (shop && shop.shopMerchandises) {
    shop.shopMerchandises.forEach(item => {
      transItem(item, 'title', maps)
      transItem(item, 'shopTitle', maps)
      transItem(item, 'comment', maps)
    })
  }
}

const transShopItem = async (data) => {
  const maps = await ensureItem()
  if (data) {
    if (Array.isArray(data.userShops)) {
      data.userShops.forEach(shop => {
        switchShop(shop, maps)
      })
    }
    if (Array.isArray(data.userEventShops)) {
      data.userEventShops.forEach(item => {
        switchShop(item.userShop, maps)
      })
    }
  }
}

const transUserItem = async (data) => {
  let list = data
  if (data.userProduceItems) list = data.userProduceItems
  const maps = await ensureItem()
  if (Array.isArray(list)) {
    list.forEach(obj => {
      const item = obj[itemTypes[0]]
      || obj[itemTypes[1]]
      || obj[itemTypes[2]]
      || obj[itemTypes[3]]
      || obj[itemTypes[4]]
      || obj[itemTypes[5]]
      || obj[itemTypes[6]]
      || obj[itemTypes[7]];
      transItem(item, 'name', maps)
      transItem(item, 'comment', maps)
    })
  }
}

const transShopPurchase = async (data) => {
  const maps = await ensureItem()
  if (data && data.shopMerchandise) {
    transItem(data.shopMerchandise, 'title', maps)
    transItem(data.shopMerchandise, 'comment', maps)
  }
}

const transPresentItem = async (data) => {
  const maps = await ensureItem()
  if (Array.isArray(data)) {
    data.forEach(obj => {
      transItem(obj.content, 'name', maps)
    })
  }
}

const transReceivePresent = async (data) => {
  const maps = await ensureItem()
  transItem(data.receivedPresent, 'Name', maps)
}

const transReceiveMission = async (data) => {
  const maps = await ensureItem()
  transItem(data.userMission.mission.missionReward.content, 'name', maps)
}

const transLoginBonus = async (data) => {
  const maps = await ensureItem()
  data.userLoginBonuses.forEach(item => {
    item.loginBonus.sheets.forEach(sheet => {
      sheet.rewards.forEach(reward => {
        transItem(reward.content, 'name', maps)
      })
    })
  })
  data.userTotalBonuses.forEach(item => {
    item.rewards.forEach(reward => {
      transItem(reward.content, 'name', maps)
    })
  })
}

const transFesReward = async (data) => {
  const maps = await ensureItem()
  if (data.lastRankingResult) {
    if (Array.isArray(data.lastRankingResult.fesMatchGradeRewards)) {
      data.lastRankingResult.fesMatchGradeRewards.forEach(item => {
        transItem(item.content, 'name', maps)
      })
    }
  }
}

const transAccumulatedPresent = async (data) => {
  const maps = await ensureItem()
  data.accumulatedPresent.userGameEventAccumulatedPresents.forEach(item => {
    item.gameEventAccumulatedPresent.rewards.forEach(reward => {
      transItem(reward.content, 'name', maps)
    })
  })
}

const selectLoginBonus = async (data) => {
  const maps = await ensureItem()
  data.rewards.forEach(reward => {
    transItem(reward.content, 'name', maps)
  })
}

export {
  transShopItem,
  transUserItem,
  userItemTypes,
  transShopPurchase,
  transPresentItem,
  transReceivePresent,
  transReceiveMission,
  transLoginBonus,
  transFesReward,
  transAccumulatedPresent,
  selectLoginBonus
}
