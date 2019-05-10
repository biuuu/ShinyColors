import debounce from 'lodash/debounce'
import config, { saveConfig } from '../config'
import { tryDownload } from './index'
import CSV from 'papaparse'

const html = `
  <style>
  #sczh-story-tool {
    position: absolute;
    display: none;
    background: #f3f5fe;
    border-radius: 20%;
    border: 2px solid rgba(78, 144, 104, 0.7);
    box-sizing: border-box;
    font-family: sczh-yuanti;
    align-items: center;
    justify-content: center;
    color: #409591;
    text-shadow: 0 0 7px #fff;
    cursor: pointer;
    user-select: none;
  }
  .story-tool-btns {
    position: absolute;
    width: 240%;
    height: 100%;
    display: none;
    right: -2px;
    top: -2px;
  }
  .story-tool-btns .btn-download-sczh,
  .story-tool-btns label {
    flex: 1;
    height: 100%;
    background: #fff;
    border-radius: 20%;
    border: 2px solid rgba(78, 144, 104, 0.7);
    display: flex;
    box-sizing: content-box;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #409591;
    text-shadow: 0 0 7px #fff;
  }
  .story-tool-btns .btn-download-sczh {
    border-radius: 0 20% 20% 0;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }
  .story-tool-btns label {
    border-radius: 20% 0 0 20%;
    color: rgba(250, 43, 101, 0.52);
    border: 2px solid rgba(250, 43, 101, 0.52);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }
  #sczh-story-tool .btn-close-sczh {
    width: 65%;
    height: 35%;
    background: rgba(0, 0, 0, 0.58);
    color: #fff;
    position: absolute;
    right: -28%;
    top: -27%;
    border-radius: 10%;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 1;
    font-family: sczh-heiti;
    font-size: 0.4em;
  }
  #sczh-story-tool:hover .story-tool-btns {
    display: flex;
  }
  #sczh-story-tool:hover .btn-close-sczh {
    display: flex;
  }
  #sczh-story-tool:hover > .text-sczh {
    display: none;
  }
  </style>
  <div id="sczh-story-tool"><span class="text-sczh">剧情</span>
    <span id="btn-close-sczh" class="btn-close-sczh">关闭</span>
    <input type="file" style="display:none" id="ipt-preview-sczh" accept=".csv">
    <div class="story-tool-btns">
      <label for="ipt-preview-sczh">预览</label>
      <div id="btn-download-sczh" class="btn-download-sczh">下载</div>
    </div>
  </div>
  `

let showToolFlag = false
const showStoryTool = (storyCache) => {
  if (showToolFlag) return
  showToolFlag = true

  document.body.insertAdjacentHTML('beforeend', html)
  const cont = document.getElementById('sczh-story-tool')
  const setToolPos = debounce(() => {
    const pos = [0.017, 0.22]
    const size = [0.058, 0.058]
    const height = window.innerHeight
    const width = window.innerWidth
    const h_w = height / width
    let ch = height
    let cw = width
    let offsetTop = 0
    let offsetRight = 0
    if (h_w > 9 / 16) {
      ch = width * 9 / 16
      offsetTop = (height - ch) / 2
    } else {
      cw = height * 16 / 9
      offsetRight = (width - cw) / 2
    }
    cont.style.right = Math.floor(offsetRight + pos[0] * cw) + 'px'
    cont.style.top = Math.floor(offsetTop + pos[1] * ch) + 'px'
    cont.style.width = Math.floor(size[0] * cw) + 'px'
    cont.style.height = Math.floor(size[1] * cw) + 'px'
    cont.style.fontSize = Math.floor(size[1] * cw * 0.35) + 'px'
    if (storyCache.name) {
      cont.style.display = 'flex'
    } else {
      cont.style.display = 'none'
    }
  }, 300)
  setToolPos()
  window.addEventListener('resize', setToolPos)
  const btnDl = document.getElementById('btn-download-sczh')
  btnDl.addEventListener('click', function () {
    if (storyCache.name) {
      const str = CSV.unparse(storyCache.list)
      tryDownload(str, storyCache.filename)
    }
  })
  const btnClose = document.getElementById('btn-close-sczh')
  btnClose.addEventListener('click', function () {
    cont.style.display = 'none'
    config.story = 'normal'
    saveConfig()
  })
}

export default showStoryTool
