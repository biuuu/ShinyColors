import getTitle from '../../store/title'
import { replaceItem } from '../../utils/replaceText'
import isString from 'lodash/isString'

let titleMaps
let titlePrms
const ensureTitle = async () => {
  if (!titlePrms) {
    titlePrms = getTitle()
  }
  titleMaps = await titlePrms
}

const storyTitle = new Map()

const saveTitle = (id, text) => {
  if (!id || !isString(text)) return
  if (!storyTitle.has(id)) storyTitle.set(id, text)
}

const transTitle = (item, key) => {
  replaceItem(item, key, titleMaps)
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

export { 
  storyTitle,
  albumTopTitle,
  characterAlbumTitle,
  userIdolsTitle,
  userSupportIdolsTitle
}