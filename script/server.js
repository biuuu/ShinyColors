const handler = require('serve-handler')
const http = require('http')
const open = require('open')

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/zeit/serve-handler#options
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Cache-Control', 'no-cache')
  return handler(request, response, {
    public: './dist/'
  })
})

server.listen(15944, async () => {
  console.log('Local server at http://127.0.0.1:15944')
  await open('http://localhost:15944/ShinyColors.user.js')
})