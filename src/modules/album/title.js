import getTitle from '../../store/title'
import getName from '../../store/name'
import { replaceItem } from '../../utils/replaceText'
import { replaceWrap, log } from '../../utils/index'
import isString from 'lodash/isString'

let titleMaps
let nameMap
let titlePrms
let namePrms
const ensureTitle = async () => {
  if (!titlePrms) {
    titlePrms = getTitle()
    namePrms = getName()
  }
  if (!titleMaps || !nameMap) {
    titleMaps = await titlePrms
    nameMap = await namePrms
    titleMaps.wordMaps = [nameMap]
  }
}

let unknownTitles = []
const collectTitles = (text) => {
  if (!text) return
  let _text = replaceWrap(text)
  if (!unknownTitles.includes(_text)) {
    unknownTitles.push(_text)
  }
}

let win = (window.unsafeWindow || window)
win.printUnknowTitles = () => log(unknownTitles.join('\n'))

const storyTitle = new Map()

const saveTitle = (id, text) => {
  if (!id || !isString(text)) return
  if (!storyTitle.has(id)) storyTitle.set(id, text)
}

const transTitle = (item, key) => {
  let text = item[key]
  replaceItem(item, key, titleMaps)
  if (DEV && text === item[key]) {
    collectTitles(text)
  }
}

const transEvents = (events) => {
  events.forEach(event => {
    transTitle(event, 'name')
    event.communications.forEach(commu => {
      transTitle(commu, 'name')
      transTitle(commu, 'title')
      saveTitle(commu.id, `${commu.name} ${commu.title}`)
    })
  })
}

const albumTopTitle = async (data) => {
  await ensureTitle()
  transEvents(data.gameEvents)
  transEvents(data.specialEvents)
}

const characterAlbumTitle = async (data) => {
  await ensureTitle()
  data.albumCommunicationTitles.forEach(item => {
    transTitle(item, 'title')
  })
  data.communications.forEach(item => {
    transTitle(item, 'title')
    saveTitle(item.communicationId, item.title)
  })
  data.voices.forEach(item => {
    transTitle(item, 'title')
    transTitle(item, 'releasedConditionComment')
  })
}

const userIdolsTitle = async (data) => {
  await ensureTitle()
  data.idol.produceAfterEvents.forEach(item => {
    transTitle(item, 'title')
    saveTitle(item.id, item.title)
  })
  data.idol.produceIdolEvents.forEach(item => {
    transTitle(item, 'title')
    saveTitle(item.id, item.title)
  })
}

const userSupportIdolsTitle = async (data) => {
  await ensureTitle()
  data.supportIdol.produceSupportIdolEvents.forEach(item => {
    transTitle(item, 'title')
    saveTitle(item.id, item.title)
  })
}

const marathonTitle = async (data) => {
  await ensureTitle()
  data.releasedCommunications.forEach(item => {
    transTitle(item, 'name')
    transTitle(item, 'title')
    saveTitle(item.id, `${item.name} ${item.title}`)
  })
  transTitle(data.gameEvent, 'name')
}

export {
  ensureTitle,
  saveTitle,
  transTitle,
  storyTitle,
  albumTopTitle,
  characterAlbumTitle,
  userIdolsTitle,
  userSupportIdolsTitle,
  marathonTitle
}