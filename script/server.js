const http = require('http')
const fs = require('fs')
const path = require('path')
const open = require('open')

const server = http.createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Cache-Control', 'no-cache')

  const parsedUrl = new URL(request.url, 'http://localhost')
  // decodeURIComponent handles spaces/special chars in path
  // path.normalize resolves '..' and converts separators for the OS
  const safePath = path.normalize(decodeURIComponent(parsedUrl.pathname)).replace(/^(\.\.[/\\])+/, '')
  const filePath = path.join('./dist', safePath)
  
  const extname = path.extname(filePath).toLowerCase()
  const contentType = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.html': 'text/html',
    '.csv': 'text/csv',
    '.txt': 'text/plain',
    '.text': 'text/plain',
  }[extname] || 'application/octet-stream'

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code == 'ENOENT') {
        console.log(`404 Not Found: ${filePath}`)
        response.writeHead(404)
        response.end('404 Not Found')
      } else {
        console.error(`500 Error: ${error.code} at ${filePath}`)
        response.writeHead(500)
        response.end('Sorry, check with the site admin for error: '+error.code+' ..\n')
      }
    } else {
      response.writeHead(200, { 'Content-Type': contentType })
      response.end(content, 'utf-8')
    }
  })
})

server.listen(15944, async () => {
  console.log('Local server at http://127.0.0.1:15944')
  await open('http://localhost:15944/ShinyColors.user.js')
})