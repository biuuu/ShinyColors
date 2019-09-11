import config from '../config'

const keepBgm = () => {
  window.addEventListener('blur', function (e) {
    if (config.bgm === 'on') e.stopImmediatePropagation()
  }, false)
  document.addEventListener('visibilitychange', function(e) {
    if (config.bgm === 'on') e.stopImmediatePropagation()
  })
}

keepBgm()