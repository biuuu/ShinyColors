## 使用
1. 建议使用 Chrome，首先安装 [Tampermonkey](https://tampermonkey.net/) 扩展
2. 扩展安装完成后，点击脚本的地址 https://www.shiny.fun/ShinyColors.user.js ，根据扩展的提示安装脚本
3. 回到游戏页面刷新

游戏地址：[直接打开](https://shinycolors.enza.fun/home) 或帮忙点下我的 [招待链接](https://go.enza.fun/YLZXbw) 来开始游戏。

如果是用手机，可以安装支持用户脚本的浏览器，使用下面的代码。
```javascript
(function(){
  const script = document.createElement('script');
  script.src = 'https://www.shiny.fun/ShinyColors.user.js';
  document.head.appendChild(script);
}())
```
已知支持用户脚本的浏览器
- iOS: Alook
- Android: Via/Kiwi/米侠/荟萃

Alook也可以直接通过这个网址安装插件：[https://www.shiny.fun/install.html](https://www.shiny.fun/install.html)

**关于机翻**

如果当前剧情还没有人提交翻译的话，插件可以进行机翻。

开启方法是在游戏 URL 后面加上 #auto=on ，关闭则是 #auto=off 。

也可以直接点这两个链接来开启或关闭，[开启机翻](https://shinycolors.enza.fun/home#auto=on)  /  [关闭机翻](https://shinycolors.enza.fun/home#auto=off)

**失去焦点后保持游戏声音**

游戏默认会在失去窗口焦点后停止声音的播放，而插件可以让声音持续播放。

开启方法是在游戏 URL 后面加上 #bgm=on ，关闭则是 #bgm=off 。

也可以直接点这两个链接来开启或关闭，[保持BGM持续播放](https://shinycolors.enza.fun/home#bgm=on)  /  [取消保持BGM播放](https://shinycolors.enza.fun/home#bgm=off)
