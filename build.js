const babel = require('rollup-plugin-babel')
const { version } = require('./package.json')
const json = require('rollup-plugin-json')

const banner = `// ==UserScript==
// @name         偶像大师ShinyColors汉化
// @namespace    https://github.com/biuuu/ShinyColors
// @version      ${version}
// @description  none
// @author       biuuu
// @match        https://shinycolors.enza.fun/*
// @run-at       document-end
// @updateURL    https://biuuu.github.io/ShinyColors/ShinyColors.user.js
// @supportURL   https://github.com/biuuu/ShinyColors/issues
// ==/UserScript==`
module.exports = {
  input: 'src/main.js',
  plugins: [
    json(),
    babel({
      exclude: 'node_modules/**',
      presets: [['@babel/preset-env', {
        modules: false,
        targets: 'since 2015'
      }]]
    })
  ],
  output: {
    file: './dist/ShinyColors.user.js',
    format: 'iife',
    name: 'shinycolors_zh',
    banner: banner
  }
};
