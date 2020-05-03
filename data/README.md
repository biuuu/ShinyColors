## 翻译数据

有兴趣一起完善翻译的话，可以加下QQ群讨论：1063178885 。

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

完成翻译后就可以提交到项目里，让其他使用插件的人看到你的翻译。如何提交翻译请参考下面的的[说明](#提交翻译)。

### 其他翻译

* phrase.csv - 常见的UI文本都在这里。
* common.csv - 补充上面缺少的文本。
* mission.csv - 任务的文本。
* name.csv - 用于剧情显示的角色名。
* type-text.csv - 部分对话框的文本翻译。
* support-skill.csv - 支援技能。
* image.csv - 替换的图片。

### 提交翻译
翻译数据均为 CSV 格式的文件，感谢所有提供翻译朋友的无私贡献。

story 目录存放所有剧情文本。

如果你想提交新的翻译文件，请在对应目录点击 Upload files 按钮，然后选择文件上传。

由于网页上无法直接创建中文目录，你也可以直接把改好名字的文件夹拖过来上传。

如果发现有问题的翻译，或者可以改进的地方，请直接点击文件然后点击右上角的“笔图标”进行修改。

以上操作建立在你已经加入 ShinyGroup 这个组织之上。除非你对 github 已经非常了解，否则都建议先加入再上传。

需要加入 ShinyGroup 请在 https://github.com/ShinyGroup/ShinyColors/issues 点击 New Issue 按钮，填上你想做什么（提交翻译、修改错误等等），我看到后会发送邀请。

**实在搞不懂这些步骤也可以直接发邮件到 umisuna@qq.com ，我来帮你上传。**

以下内容是介绍在未加入 ShinyGroup 的情况如何提交翻译，如果对 git 原理不太了解则不建议阅读。

```
对于未加入 ShinyGroup 的翻译人员，希望直接上传文件或者需要一次提交多个文件的话，
先打开 https://github.com/ShinyGroup/ShinyColors ，然后点右上角的 Fork 按钮，这时你自己的账号下就有了一个同名的项目。
在你账号的项目里找到 data/story 目录，点击右上角的 Upload Files 按钮，就能一次上传多个文件了。
添加或修改剧情后，点 Pull request 即可发起请求将修改合并到主分支。
```

**注意事项：**

已经 Fork 的项目并不会自动跟原项目保持一致。

如果不是第一次提交翻译，则可能会发生冲突，
需要从最新的 提交（Commit） 新建一个 分支（Branch） 后再进行修改或上传新文件操作。

下面简述一下如何通过 github 的网页新建一个最新的分支。
1. 打开 Commit 记录列表 https://github.com/ShinyGroup/ShinyColors/commits/master
2. 每一条记录后面有一个`<>`这样的按钮，点最上面那一条打开 `https://github.com/ShinyGroup/ShinyColors/tree/******` 类似这样一个地址
3. 把这个地址 `https://github.com/ShinyGroup/ShinyColors/tree/******` 的 `ShinyGroup` 改成你的用户名 `https://github.com/yourName/ShinyColors/tree/******`（即yourName 部分用你的用户名代替）
4. 然后再新打开的页面，点击 Tree 按钮，输入一个新的分支名，新建一个分支。
5. 现在你已经创建了一个新分支，并且内容是最新的。在这里修改或上传文件后即可发起 Pull request。

**关于上面的 fork 和 pull request 步骤，如果你是已经加入 ShinyGroup 的翻译人员可以省略，请直接在 ShinyGroup/ShinyColors 的 master 分支上修改或上传，无需再发起 pull request**

## License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />翻译文本采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>共享
