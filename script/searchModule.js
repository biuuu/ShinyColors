// player = 64  textPlayer
// load scenario = 260  load
// request = 2  request
// phrase = 4
var keyword = 'load'
for (let i = 0; i < 900; i++) {
  let module = primJsp([],[],[i])
  if (module && (module[keyword] || (module.default && module.default[keyword]))) {
    console.log(i, module)
  }
}