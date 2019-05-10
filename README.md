# 偶像大师ShinyColors汉化

## 使用
1. 建议使用 Chrome，首先安装 [Tampermonkey](https://tampermonkey.net/) 扩展
2. 扩展安装完成后，点击脚本的地址 https://biuuu.github.io/ShinyColors/ShinyColors.user.js ，根据扩展的提示安装脚本
3. 回到游戏页面刷新

## 翻译
翻译数据在 data 目录下，欢迎提交或修改。

有兴趣一起完善翻译内容的话可以加下 QQ 群：1018154722 。

关于机翻：v0.4.2 新增了剧情自动机翻功能，不过当剧情还没人提交翻译时才会出现。

开启方法是在游戏 URL 后面加上 #auto=on ，关闭则是 #auto=off 。

也可以直接点这两个链接来开启或关闭，[开启机翻](https://shinycolors.enza.fun#auto=on)  /  [关闭机翻](https://shinycolors.enza.fun#auto=off)
## Devlopment

```bash
# 全局安装 yarn
npm install -g yarn

# 用 yarn 安装模块
yarn install

# 构建用户脚本
yarn build

# 打包CSV和构建用户脚本，并push到当前repo的gh-pages分支
yarn deploy
```

## License
The code is [MIT](https://github.com/biuuu/ShinyColors/blob/master/LICENSE) licensed,
but the translation text has another License. see [details](https://github.com/biuuu/ShinyColors/tree/master/data)
