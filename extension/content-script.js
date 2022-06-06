const mutationCallback = (mutationsList) => {
  for (let mutation of mutationsList) {
    const addedNodes = mutation.addedNodes
    addedNodes.forEach(node => {
      if ('SCRIPT' === node.tagName) {
        node.defer = false
        if (node.src.includes('shinycolors.enza.fun/app')) {
          node.async = true
          observer.disconnect()
        }
      }
    })
  }
}

const obConfig = {
  subtree: true,
  childList: true
}

const targetNode = document
const observer = new MutationObserver(mutationCallback)
observer.observe(targetNode, obConfig)