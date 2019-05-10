const Fontmin = require('fontmin')
const ttf2woff2 = require('gulp-ttf2woff2')
const glob = require('glob')
const fs = require('fs')

const srcPath = ['localfont/heiti.ttf', 'localfont/yuanti.ttf', 'localfont/yuanti2.ttf']
const destPath = 'data/font'
let text = '剧情预览下载关闭'
for (let i = 33; i < 127; i++) {
  text += String.fromCharCode(i)
}

const readString = (file) => {
  return new Promise((rev, rej) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) rej(err)
      rev(data)
    })
  })
}

const appendText = (str) => {
  let len = str.length
  for (let i = 0; i < len; i++) {
    if (!text.includes(str[i])) {
      text += str[i]
    }
  }
}

const start = (src, txt, removeJa = false) => {
  if (removeJa) {
    txt = txt.replace(/[\u3040-\u30ff\uff66-\uff9f]/g, '')
  }
  const fontmin = new Fontmin()
  .src(src)
  .use(Fontmin.glyph({
      text: txt,
      hinting: false
  }))
  .use(ttf2woff2({ clone: false }))
  .dest(destPath)

  fontmin.run(function (err, files, stream) {
    if (err) {
      console.error(err)
    }
  })
}

glob('{data/**/*.csv,script/text.txt}', function (err, files) {
  if (err) {
    console.error(err)
  }
  const prims = files.map(file => {
    return readString(file)
  })

  Promise.all(prims).then(txts => {
    txts.forEach(appendText)
    glob('localtext/*.csv', function (err, files) {
      let _text = text
      let _txt = ''
      Promise.all(files.map(file => {
        return readString(file).then(txt => {
          if (txt) {
            for (let i = 0; i < txt.length; i++) {
              if (!_text.includes(txt[i])) {
                _text += txt[i]
                _txt += txt[i]
              }
            }
          }
        })
      })).then(() => {
        console.log(_txt)
      })
    })
    console.log(text.length + '个字符')
    start(srcPath[0], text)
    start(srcPath[1], text, true)
    if (srcPath[2]) start(srcPath[2], text, true)
  })
})
