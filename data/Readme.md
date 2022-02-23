## 翻译数据

如果还未安装汉化插件，请先看这边的[说明](https://github.com/biuuu/ShinyColors/blob/master/src/README.md)来装上汉化插件。

**因翻译文本由玩家自发提供，非专业翻译，可能有很多地方都有问题。如果你更合适的翻译或建议，都欢迎随时提交。同样的，出于完善翻译的目的，你自己提交的翻译也可能随时会被修改。**

### 用插件提取剧情文本

剧情提取功能的开启方法是在游戏 URL 后面加上 #story=edit ，关闭则是 #story=normal 。

也可以直接点这两个链接来开启或关闭，[开启剧情提取](https://shinycolors.enza.fun/home#story=edit)  /  [关闭剧情提取](https://shinycolors.enza.fun/home#story=normal)

开启剧情提取功能后查看剧情时，可以看到右边出现了“剧情”按钮，鼠标移上去可以选择“下载”或“预览”。

1. 下载：下载最后浏览过的剧情的 CSV 文件。
2. 预览：选择翻译后的 CSV 文件进行预览，可以多选。不刷新页面时会缓存所有选择的剧情文件，刷新页面后只保留最后选择的5个文件。关闭页面后则清空所有预览文件。

**关于剧情文本的格式：**
使用任意文本编辑器打开，可以看到文件的第一行是“id,name,text,trans”，这代表这个文件是一个 4 列的表格，通过半角逗号分隔。

前 3 列分别是对话的ID，对话的角色名字，剧情文本的原文。这 3 列都不需要改动，你只需要填写最后的 trans 列，即译文。

当你在 trans 列填写上对应的翻译后，就可以进行预览。

**注意：**
插件提供的是utf8编码的逗号分隔的csv文件，你的系统可能会默认用表格类软件打开。但这些表格类软件往往会无视文件原本的编码，这样保存后的文件无法使用。
因此建议使用文本编辑器来编辑，推荐用https://code.visualstudio.com/ 。

完成翻译后就可以提交到项目里，让其他使用插件的人看到你的翻译。有意向提交翻译的话请参考这边的说明：[提交翻译](https://github.com/ShinyGroup/SCTranslationData) 。

### 其他翻译

* phrase.csv - 常见的UI文本都在这里。
* common.csv - 补充上面缺少的文本。
* mission.csv - 任务的文本。
* name.csv - 用于剧情显示的角色名。
* type-text.csv - 部分对话框的文本翻译。
* support-skill.csv - 支援技能。
* image.csv - 替换的图片。

## License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />翻译文本采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>共享
