<a href="https://www.shiny.fun/ShinyColors.user.js"><img src="data/image/banner.jpg" alt="检查更新"></a>
<p align="center">
<a href="https://github.com/biuuu/ShinyColors/actions?query=workflow%3ABuild"><img alt="Build Status" src="https://github.com/biuuu/ShinyColors/workflows/Build/badge.svg?branch=master"></a>
<a href="https://github.com/biuuu/ShinyColors/blob/master/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/biuuu/ShinyColors.svg"></a>
<a href="https://idolmaster.jp/"><img alt="THE IDOLM@STER" src="https://img.shields.io/badge/IDOL-M%40STER-ff779c.svg"></a>
<a href="https://shinycolors.enza.fun/"><img alt="283 Production" src="https://img.shields.io/badge/283-Production-9a77ff.svg"></a>
</p>

---

这次的游戏更新隐藏了之前游戏代码里暴露的一些模块。无法确定能不能找到新的办法来使用用户脚本进行汉化。所以暂时注释代码避免影响到启用了翻译插件的玩家。

This game update hides some modules exposed in the previous game code. I am not sure if I can find a new way to use the user script for localization. So temporarily comment the code to avoid affecting players who have enabled the translation plugin.

## 简介
安装插件：[说明](https://github.com/biuuu/ShinyColors/blob/master/src/README.md)

提交翻译：[说明](https://github.com/ShinyGroup/SCTranslationData)

## Devlopment
```bash
# 全局安装 yarn
npm install -g yarn

# 用 yarn 安装模块
yarn install

# 调试模式，构建一个用户脚本，并使用本地数据源
yarn dev

# 构建用户脚本
yarn build

# 打包CSV和构建用户脚本，并push到当前repo的gh-pages分支
yarn deploy
```

## License
The code is [MIT](https://github.com/biuuu/ShinyColors/blob/master/LICENSE) licensed,
but the translation text has another License. see [details](https://github.com/biuuu/ShinyColors/tree/master/data)
