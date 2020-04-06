import debounce from 'lodash/debounce'
import config, { saveConfig, PREVIEW_COUNT } from '../config'
import { tryDownload } from './index'
import CSV from 'papaparse/papaparse.min'
import { getStoryMap } from '../store/story'

const html = `
  <style>
  #sczh-story-tool {
    position: absolute;
    display: none;
    background: #ffffff;
    border-radius: 24px;
    box-sizing: border-box;
    font-family: sczh-yuanti;
    align-items: center;
    justify-content: center;
    color: #ff6499;
    text-shadow: 0 0 6px #fff;
    cursor: pointer;
    user-select: none;
    width: 100px;
    height: 100px;
    font-size: 32px;
    border: 7px solid transparent;
    border-image: url(${config.origin}/data/image/border.png);
    border-image-slice: 7;
    transform-origin: top right;
  }
  .story-tool-btns {
    width: 100%;
    height: 100%;
    display: none;
  }
  .story-tool-btns .btn-download-sczh,
  .story-tool-btns label {
    flex: 1;
    height: 100%;
    background: #fff;
    display: flex;
    box-sizing: content-box;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #c0aade;
    text-shadow: 0 0 6px #fff;
  }
  .story-tool-btns .btn-download-sczh:hover {
    color: #9f66ec;
  }
  .story-tool-btns label {
    color: rgb(242, 156, 199);
    border-right: 1px solid #c9c9c9;
  }
  #sczh-story-tool .btn-close-sczh {
    height: 25px;
    width: 50px;
    background: rgba(0, 0, 0, 0.58);
    color: #fff;
    letter-spacing: 2px;
    position: absolute;
    right: -25px;
    top: -20px;
    border-radius: 4px;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 1;
    font-family: sczh-heiti;
    font-size: 15px;
  }
  #sczh-story-tool:hover {
    width: 200px;
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
  #sczh-story-tool .btn-close-sczh:hover {
    background: rgba(0, 0, 0, 0.9);
  }
  .story-tool-btns label:hover {
    color: #f270b1;
  }
  .story-tool-btns .btn-download-sczh:hover,
  .story-tool-btns label:hover {
    background-color: #f7f7f7;
  }
  </style>
  <div id="sczh-story-tool"><span class="text-sczh">剧情</span>
    <span id="btn-close-sczh" class="btn-close-sczh">关闭</span>
    <input type="file" style="display:none" id="ipt-preview-sczh" multiple accept=".csv">
    <div class="story-tool-btns">
      <label for="ipt-preview-sczh">预览</label>
      <div id="btn-download-sczh" class="btn-download-sczh">下载</div>
    </div>
  </div>
  `
const savePreview = (map) => {
  const arr = [...map].slice(-PREVIEW_COUNT)
  const newArr = arr.map(item => {
    item[1] = [...item[1]]
    return item
  })
  sessionStorage.setItem('sczh:preview', JSON.stringify(newArr))
}

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
    cont.style.transform = `scale(${(ch/900).toFixed(3)})`
    // cont.style.width = Math.floor(size[0] * cw) + 'px'
    // cont.style.height = Math.floor(size[1] * cw) + 'px'
    // cont.style.fontSize = Math.floor(size[1] * cw * 0.35) + 'px'
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
  const iptPreview = document.getElementById('ipt-preview-sczh')
  iptPreview.addEventListener('change', function () {
    const files = this.files
    if (!files.length) return
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        const text = e.target.result
        const storyMap = getStoryMap(text)
        if (storyMap.has('name')) {
          const _name = storyMap.get('name')
          storyCache.preview.set(_name, storyMap)
          savePreview(storyCache.preview)
          alert(`导入${_name}成功`)
        }
      }
      reader.readAsText(file)
    })
  })
}

export default showStoryTool
