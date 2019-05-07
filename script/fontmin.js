const Fontmin = require('fontmin')
const ttf2woff2 = require('gulp-ttf2woff2')
const glob = require('glob')
const fs = require('fs')

const srcPath = ['localfont/heiti.ttf', 'localfont/yuanti.ttf']
const destPath = 'data/font'
let text = ''
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

glob('data/**/*.csv', function (err, files) {
  if (err) {
    console.error(err)
  }
  const prims = files.map(file => {
    return readString(file)
  })

  Promise.all(prims).then(txts => {
    txts.forEach(appendText)
    console.log(text.length)
    const fontmin = new Fontmin()
    .src(srcPath)
    .use(Fontmin.glyph({
        text: text,
        hinting: false
    }))
    .use(ttf2woff2({ clone: false }))
    .dest(destPath)

    fontmin.run(function (err, files, stream) {
      if (err) {
        console.error(err)
      }

      console.log('done')
    })
  })
})
