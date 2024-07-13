# 使用Flutter进行桌面开发踩坑

## Windows1803之前版本的兼容性问题

Flutter在Windows1803之前版本会遇到以下问题：

- 系统中文输入法导致崩溃，当中文输入法存在待选字符时，切换页面，会导致输入法缓冲区异常，然后程序崩溃
- 计算窗口大小异常，在Win10 1803前后版本中，使用[window_size](https://github.com/google/flutter-desktop-embedding)计算窗口大小的结果不同
- 字体显示模糊，需要用户手动在exe兼容性中进行设置

## UI编写相对困难

Flutter自带了两个UI套件，Material风格和Cupertino风格，前者是Android平台的官方风格，后者是IOS平台的官方风格。

使用Flutter进行桌面GUI开发通常使用MD3，但其实这套控件主要是为Android平台设计，不太适合Windows桌面使用，需要对控件进行大量自定义设置。

当然，以上对习惯原生开发的开发者来说并不是问题，但无论如何，相比Wails,Tauri,Electron这些基于Web的跨平台开发方案来说，Flutter的效率相对较低。

## 一些细节问题

### String.fromEnvironment与Platform.environment

当我需要访问环境变量时，搜索结果大部分是`String.fromEnvironment`。

但实际上`String.fromEnvironment`用于读取Flutter定义的`编译时环境变量`，并不是我想要的系统环境变量，应当通过`Platform.environment`来访问。




