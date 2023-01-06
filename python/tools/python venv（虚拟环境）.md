# 什么是虚拟环境？
操作系统、开发套件、工具链、包管理器、依赖包等等项目所依赖的一系列支撑被统称为`环境`，虚拟环境就是为特定项目提供一个独享的`环境`，这个环境其依赖于宿主操作系统、宿主操作系统上安装的开发套件...，因此加以`虚拟`修饰。

[python venv](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)是Python项目的一个官方虚拟环境实现，主要包括：

- 独立的解释器
- 独立的包管理器
- 独立的依赖

# 虚拟环境的使用
创建虚拟环境，其中`tutorial-env`为工程目录：
```
python3 -m venv tutorial-env
```

执行相关脚本，在命令行激活虚拟环境：
```
# Windows
tutorial-env\Scripts\activate.bat

#unix like
source tutorial-env/bin/activate
```

## IDE
Pycharm提供了对venv支持，提供人性化的交互界面。

VSCode并没有提供太多支持，有时会检测到venv的存在，但有时需要在终端中手动加载激活脚本。