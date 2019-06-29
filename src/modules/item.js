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
  if (!item) return
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
  const maps = await getItem()
  if (data && data.shopMerchandise) {
    transItem(data.shopMerchandise, 'title', maps)
    transItem(data.shopMerchandise, 'comment', maps)
  }
}

const transPresentItem = async (data) => {
  const maps = await getItem()
  if (Array.isArray(data)) {
    data.forEach(obj => {
      transItem(obj.content, 'name', maps)
    })
  }
}

const transReceivePresent = async (data) => {
  const maps = await getItem()
  transItem(data.receivedPresent, 'Name', maps)
}

const transReceiveMission = async (data) => {
  const maps = await getItem()
  transItem(data.userMission.mission.missionReward.content, 'name', maps)
}

const transLoginBonus = async (data) => {
  const maps = await getItem()
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
  const maps = await getItem()
  if (data.lastRankingResult) {
    if (Array.isArray(data.lastRankingResult.fesMatchGradeRewards)) {
      data.lastRankingResult.fesMatchGradeRewards.forEach(item => {
        transItem(item.content, 'name', maps)
      })
    }
  }
}

const transAccumulatedPresent = async (data) => {
  const maps = await getItem()
  data.accumulatedPresent.userGameEventAccumulatedPresents.forEach(item => {
    item.gameEventAccumulatedPresent.rewards.forEach(reward => {
      transItem(reward.content, 'name', maps)
    })
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
  transAccumulatedPresent
}
