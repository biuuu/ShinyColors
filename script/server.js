const handler = require('serve-handler')
const https = require('https')
const fs = require('fs')
const open = require('open')

// SSL/TLS 인증서 및 키 파일 경로 설정
const options = {
  key: fs.readFileSync('path/to/your/private-key.pem'),
  cert: fs.readFileSync('path/to/your/certificate.pem')
}

const server = https.createServer(options, (request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/zeit/serve-handler#options
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Cache-Control', 'no-cache')
  return handler(request, response, {
    public: './dist/'
  })
})

server.listen(15944, async () => {
  console.log('Local server at https://127.0.0.1:15944')
  await open('https://localhost:15944/ShinyColors.user.js')
})