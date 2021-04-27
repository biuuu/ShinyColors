## 使用
1. 建议使用 Chrome，首先安装 [Violentmonkey](https://violentmonkey.github.io/get-it) 扩展
2. 扩展安装完成后，点击脚本的地址 https://www.shiny.fun/ShinyColors.user.js ，根据扩展的提示安装脚本
3. 回到游戏页面刷新

游戏地址：[直接打开](https://shinycolors.enza.fun/home) 或帮忙点下我的 [招待链接](https://go.enza.fun/YLZXbw) 来开始游戏。

如果是用手机，可以使用支持用户脚本的浏览器来安装插件。

已知支持用户脚本的浏览器
- iOS: Alook
- Android: Kiwi

Kiwi浏览器安装插件的方法跟PC一致，先安装Violentmonkey扩展，再点击脚本地址添加用户脚本

Alook可以直接通过这个网址安装插件：[https://www.shiny.fun/install.html](https://www.shiny.fun/install.html)

注意需要在弹出的安装窗口，将 “运行时间” 改为 “尽早”。

另外Alook也可以按下面的步骤自行添加插件：
- 设置 -> 自定义设置 -> JavaScript扩展
- 点加号 -> 新建被动扩展
- 名称随便填，匹配类型选域名，匹配值`shinycolors.enza.fun`，运行时间尽早

JavaScript代码栏里，填写如下代码：
```javascript
(function () {
  let scriptContent = '';
  let version = '';
  const script = document.createElement('script');
  try {
    scriptContent = localStorage.getItem('sczh-script');
    version = localStorage.getItem('sczh-version');
  } catch (e) {}
  if (!scriptContent) {
    script.setAttribute('src', 'https://www.shiny.fun/ShinyColors.user.js');
    script.setAttribute('defer', true);
  } else {
    script.textContent = scriptContent;
  }
  document.documentElement.appendChild(script);
  fetch('https://www.shiny.fun/manifest.json')
    .then(res => res.json())
    .then(async function (data) {
      if (data.version !== version) {
        const text = await (await fetch('https://www.shiny.fun/ShinyColors.user.js')).text();
        localStorage.setItem('sczh-script', text);
        localStorage.setItem('sczh-version', data.version);
      }
    })
})();
```

**使用插件提取文本和预览翻译**

插件提供了提取剧情文本并预览的功能，如果你经常录翻译视频，可以考虑使用这个功能节省手动添加字幕的步骤。

详情查看 https://github.com/biuuu/ShinyColors/blob/master/data/README.md

将自己的翻译录成视频并没有任何限制，但录制他人的翻译前需要取得译者的同意。


**关于机翻**

如果当前剧情还没有人提交翻译的话，插件可以进行机翻。

开启方法是在游戏 URL 后面加上 #auto=on ，关闭则是 #auto=off 。

也可以直接点这两个链接来开启或关闭，[开启机翻](https://shinycolors.enza.fun/home#auto=on)  /  [关闭机翻](https://shinycolors.enza.fun/home#auto=off)

**失去焦点后保持游戏声音**

游戏默认会在失去窗口焦点后停止声音的播放，而插件可以让声音持续播放。

开启方法是在游戏 URL 后面加上 #bgm=on ，关闭则是 #bgm=off 。

也可以直接点这两个链接来开启或关闭，[保持BGM持续播放](https://shinycolors.enza.fun/home#bgm=on)  /  [取消保持BGM播放](https://shinycolors.enza.fun/home#bgm=off)

**无法访问脚本链接**

如果点不开脚本地址，可能是因网络问题无法访问 `www.shiny.fun` 这个域名。

可以试着用 https://cdn.jsdelivr.net/gh/biuuu/ShinyColors@gh-pages/ShinyColors.user.js 这个地址安装。

并在进入游戏后通过在游戏 URL 后面加上 `#origin=https://cdn.jsdelivr.net/gh/biuuu/ShinyColors@gh-pages` 修改数据源。

改回默认数据源则是 `#origin=` 。

也可以直接点这两个链接来修改或恢复，[修改数据源](https://shinycolors.enza.fun/home#origin=https://cdn.jsdelivr.net/gh/biuuu/ShinyColors@gh-pages)  /  [取消修改](https://shinycolors.enza.fun/home#origin=)

上面涉及到 `www.shiny.fun` 地方的操作都可以替换为 `cdn.jsdelivr.net/gh/biuuu/ShinyColors@gh-pages`
