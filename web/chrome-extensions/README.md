# 概述

Chrome Extension由Web技术（html,css,javascript）提供支撑，其组成部分包括：

- [background scripts](https://developer.chrome.com/docs/extensions/mv3/background_pages/) 后台脚本
- [content scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) 内容脚本
- [options page](https://developer.chrome.com/docs/extensions/mv3/options/) 选项页面
-  [UI elements](https://developer.chrome.com/docs/extensions/mv3/user_interface/) 界面元素（比如popup）

Chrome扩展是一个`web应用`，具体来讲，是一个使用`zip`格式压缩的文件夹，里面包含一个`mainifest.json`以及使用web技术编写的`组成部分`。

# manifest.json

扩展的元信息文件，包括扩展的元信息（项目名称、描述、版本……）、内容声明、权限声明……

# 后台脚本

在后台执行的，基于消息的异步执行器。

由于内容脚本无法执行CORS请求，需要使用后台脚本来执行CORS请求。

# 内容脚本

Chrome允许扩展注入javascript,css文件到匹配路径下的所有页面，从而在交互、逻辑上影响目标页面。

# 选项页面

扩展拥有的独立web页面，它可以被用来配置选项，也可以被用来承载应用。

# 界面元素

Chrome为扩展提供了一些交互元素。比如，在点击菜单栏中的扩展图标时，会打开`popup页面`。

# 参考

[extensions v3](https://developer.chrome.com/docs/extensions/mv3/getstarted/)

