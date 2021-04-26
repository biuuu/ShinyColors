// beforescriptexecute polyfill
let scriptWatcher
if (!('onbeforescriptexecute' in document)) { // Already natively supported
  scriptWatcher = new MutationObserver(mutations => {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (node.tagName === 'SCRIPT') {
          let syntheticEvent = new CustomEvent('beforescriptexecute', {
            detail: node,
            cancelable: true
          })
          // .dispatchEvent will execute the event synchrously,
          // and return false if .preventDefault() is called
          if (!document.dispatchEvent(syntheticEvent)) {
            node.remove();
          }
        }
      }
    }
  })
  scriptWatcher.observe(document, {
    childList: true,
    subtree: true
  })
}


const fixModule = (text) => {
  let source = [/(\w)\.(\w)=function\((\w)\)\{var\s(\w)=\[\]/, 'Object.freeze({addHeader:']
  let result = [';window._require=$1;$1.$2=function($3){var $4=[]', '({addHeader:']
  for (let i = 0; i < source.length; i++) {
    if (text) {
      console.log('Match found: ' + source[i])
      text = text.replace(source[i], result[i])
    }
  }
  return text
}

const injectModule = (text) => {
  text = fixModule(text)
  var newScript = document.createElement('script')
  newScript.type = 'text/javascript'
  newScript.textContent = text
  var head = document.getElementsByTagName('body')[0]
  head.appendChild(newScript)
}

const bseHandler = function (e) {
  let script = e.detail || e.target
  scriptHandler(script, e)
}

const disconnect = () => {
  scriptWatcher.disconnect()
  document.removeEventListener('beforescriptexecute', bseHandler)
}

const scriptHandler = (target, e) => {
  if (/app-[\w\d]{20}\.js/.test(target.src)) {
    e.preventDefault()
    e.stopPropagation()
    disconnect()
    fetch(target.src)
      .then(res => res.text())
      .then(text => injectModule(text))
  }
}

document.addEventListener('beforescriptexecute', bseHandler)