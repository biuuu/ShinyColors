## 使用
1. 建议使用 Chrome，首先安装 [Tampermonkey](https://tampermonkey.net/) 扩展
2. 扩展安装完成后，点击脚本的地址 https://biuuu.github.io/ShinyColors/ShinyColors.user.js ，根据扩展的提示安装脚本
3. 回到游戏页面刷新

如果是用手机，可以安装支持用户脚本的浏览器，使用下面的代码。
```javascript
(function(){
  const script = document.createElement('script');
  script.src = 'https://biuuu.github.io/ShinyColors/ShinyColors.user.js';
  document.head.appendChild(script);
}())
```
已知支持用户脚本的浏览器
- iOS: Alook
- Android: Via/Kiwi/米侠/荟萃

**关于机翻**
如果当前剧情还没有人提交翻译的话，插件可以进行机翻。

开启方法是在游戏 URL 后面加上 #auto=on ，关闭则是 #auto=off 。

也可以直接点这两个链接来开启或关闭，[开启机翻](https://shinycolors.enza.fun#auto=on)  /  [关闭机翻](https://shinycolors.enza.fun#auto=off)
