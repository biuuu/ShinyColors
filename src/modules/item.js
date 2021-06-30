import { replaceItem } from '../utils/replaceText'
import tagText from '../utils/tagText'
import transApi from './api-comm'

const { api, getTransItem, ensureData } = transApi('etc/item-re')

const transDesc = getTransItem((item, key, data) => {
  if (item?.[key]) {
    let arr = item[key].split('\n')
    arr.forEach((txt, index) => {
      replaceItem(arr, index, data)
    })
    let text = arr.join('\n')
    if (text !== item[key]) {
      item[key] = tagText(text, true)
    }
  }
})

const transName = getTransItem(replaceItem)
const transShopTitle = getTransItem((item, key, data) => {
  if (item?.[key]) {
    let text = item[key]
    replaceItem(item, key, data)
    if (item[key] === text) {
      item[key] = item[key].replace('\n', '')
      replaceItem(item, key, data)
    }
  }
})

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

const switchShop = (shop) => {
  shop?.shopMerchandises?.forEach(item => {
    transName(item, 'title')
    transShopTitle(item, 'shopTitle')
    transDesc(item, 'comment')
    item.shopContents?.forEach(data => {
      transName(data.content, 'name')
      transDesc(data.content, 'comment')
    })
  })
}

const transShopItem = (data) => {
  if (data) {
    if (Array.isArray(data.userShops)) {
      data.userShops.forEach(shop => {
        switchShop(shop)
      })
    }
    if (Array.isArray(data.userEventShops)) {
      data.userEventShops.forEach(item => {
        switchShop(item.userShop)
      })
    }
  }
}

const transUserItem = (data) => {
  let list = data
  if (data.userProduceItems) list = data.userProduceItems
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
      transName(item, 'name')
      transDesc(item, 'comment')
    })
  }
}

const transShopPurchase = (data) => {
  transName(data?.shopMerchandise, 'title')
  transDesc(data?.shopMerchandise, 'comment')
}

const transPresentItem = (data) => {
  if (Array.isArray(data)) {
    data.forEach(obj => {
      transName(obj.content, 'name')
      transName(obj, 'note')
    })
  }
}

const transReceivePresent = (data) => {
  transName(data.receivedPresent, 'Name')
}

const transReceiveMission = (data) => {
  transName(data.userMission.mission.missionReward.content, 'name')
}

const transLoginBonus = (data) => {
  data.userLoginBonuses.forEach(item => {
    item.loginBonus.sheets.forEach(sheet => {
      sheet.rewards.forEach(reward => {
        transName(reward.content, 'name')
      })
    })
  })
  data.userTotalBonuses.forEach(item => {
    item.rewards.forEach(reward => {
      transName(reward.content, 'name')
    })
  })
}

const transFesReward = (data) => {
  if (data.lastRankingResult) {
    if (Array.isArray(data.lastRankingResult.fesMatchGradeRewards)) {
      data.lastRankingResult.fesMatchGradeRewards.forEach(item => {
        transName(item.content, 'name')
      })
    }
  }
}

const transAccumulatedPresent = (data) => {
  data.accumulatedPresent.userGameEventAccumulatedPresents.forEach(item => {
    item.gameEventAccumulatedPresent.rewards.forEach(reward => {
      transName(reward.content, 'name')
    })
  })
}

const selectLoginBonus = (data) => {
  data.rewards.forEach(reward => {
    transName(reward.content, 'name')
  })
}

const produceActiveItem = (data) => {
  data?.activeProduceItems?.forEach(item => {
    transName(item.produceItem, 'name')
    transDesc(item.produceItem, 'comment')
  })
}

const homeProduceActiveItem = (data) => {
  produceActiveItem(data.userProduce)
}

const useProduceItem = (data) => {
  const item = data.consumeProduceItem?.produceItem
  if (item) {
    transName(item, 'name')
    transDesc(item, 'comment')
  }
}

const gachaResult = data => {
  data.acquiredStampRewards?.forEach(item => {
    transName(item.content, 'name')
  })
}

const gashaGroups = data => {
  data.gashaGroups?.forEach(group => {
    const item = group.userGashaTicket?.gashaTicket
    transName(item, 'name')
    transDesc(item, 'comment')
  })
}

api.get([
  [['userShops', 'userIdolPieceShops'], transShopItem],
  [userItemTypes, transUserItem],
  [['userPresents\\?limit={num}', 'userPresentHistories\\?limit={num}'], transPresentItem],
  ['userProduces', produceActiveItem],
  ['missionEvents/{num}/top', transAccumulatedPresent],
  ['gashaGroups', gashaGroups]
])

api.post([
  ['myPage', homeProduceActiveItem],
  ['(produceMarathons|fesMarathons|trainingEvents)/{num}/top', transAccumulatedPresent],
  ['userShops/actions/purchase', transShopPurchase],
  ['produces/{num}/actions/ready', transUserItem],
  ['userPresents/{num}/actions/receive', transReceivePresent],
  ['userMissions/{num}/actions/receive', transReceiveMission],
  ['userLoginBonuses', transLoginBonus],
  ['fesTop', transFesReward],
  ['userSelectLoginBonuses/{num}', selectLoginBonus],
  ['gashas/{num}/actions/draw', gachaResult]
])

api.patch([
  ['produces/{num}/produceItem/consume', useProduceItem]
])

export { transName as transItemName, transDesc as transItemDesc, ensureData as ensureItemData }