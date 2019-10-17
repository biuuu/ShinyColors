const babel = require('rollup-plugin-babel')
const { version } = require('../package.json')
const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const cmjs = require('rollup-plugin-commonjs')

const banner = `// ==UserScript==
// @name         偶像大师ShinyColors汉化
// @namespace    https://github.com/biuuu/ShinyColors
// @version      ${version}
// @description  提交翻译或问题请到 https://github.com/biuuu/ShinyColors
// @icon         https://shinycolors.enza.fun/icon_192x192.png
// @author       biuuu
// @match        https://shinycolors.enza.fun/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      api.interpreter.caiyunai.com
// @connect      translate.google.cn
// @connect      fanyi.baidu.com
// @updateURL    https://www.shiny.fun/ShinyColors.user.js
// @supportURL   https://github.com/biuuu/ShinyColors/issues
// ==/UserScript==`
module.exports = {
  input: 'src/main.js',
  plugins: [
    resolve({ preferBuiltins: false }),
    cmjs({ ignore: ['stream'] }),
    json(),
    babel({
      exclude: 'node_modules/**',
      presets: [['@babel/preset-env', {
        modules: false,
        targets: 'last 3 iOS versions'
      }]]
    })
  ],
  output: {
    file: './dist/ShinyColors.user.js',
    format: 'iife',
    name: 'shinycolors_zh',
    banner: banner,
    intro: `const ENVIRONMENT = "${process.env.BUILD === 'development' ? 'development' : ''}";
    const DEV = ${process.env.DEV ? true : false};
    const SHOW_UPDATE_TEXT = ${process.env.TEXT ? true : false};
    const COLLECT_CARD_RATE = ${process.env.CARD ? true : false};`
  }
};
