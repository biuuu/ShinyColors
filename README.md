# 偶像大师ShinyColors汉化

## 使用
1. 建议使用 Chrome，首先安装 [Tampermonkey](https://tampermonkey.net/) 扩展
2. 扩展安装完成后，点击脚本的地址 https://biuuu.github.io/ShinyColors/ShinyColors.user.js ，根据扩展的提示安装脚本
3. 回到游戏页面刷新

目前使用的中文字体文件如下，因一般字体跟游戏原字体位置相比有偏移，强烈建议下载安装。（安装字体后需要重启浏览器生效）

https://pan.baidu.com/s/1PYbfObAO9zGZaNmAIsDP6A 提取码: z4b5

## 翻译
翻译数据在 data 目录下，欢迎提交或修改。

目前只有 UI 的文本，直接编辑 phrase.csv 即可。

有兴趣一起完善翻译内容的话可以加下 QQ 群：1018154722 。
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
