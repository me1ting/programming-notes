# 桌面gui选型

## 跨平台

### WebView

WebView的优点是开发效率高，缺点是UI性能较差，为了保证体验需要进行性能优化。

#### Wails

基于Golang语言的WebView方案。

Wails的一个缺点是存在报毒问题。

#### Tauri

基于Rust语言的WebView方案，完成度比Wails高。

Tauri也存在报毒问题，但是比Wails好一点。

示例：clash-verge,gitbutler（一款很漂亮的git client）。

#### Electron

基于JS语言的WebView方案，自带Chromium运行时。

示例：VSCode,Github Desktop,QQ。

### Compose Multiplatform

Jetbrian推出的跨平台GUI框架，基于Kotlin语言。

Kotlin是Android的官方开发语言，目前最新的官方UI框架是Jetpack Compose，Compose Multiplatform其实就是Jetpack Compose在其它平台上的移植，其思路基本照抄Flutter。

个人认为Compose Multiplatform并非一个值得投资的跨平台GUI框架：基于JVM，意味着在文件大小、内存占用大小上存在劣势，即使编译为Native也只能弥补部分劣势。

在桌面平台上，Compose Multiplatform应用包含一个JRE(ACFun 64M,RunFlow 90M)，除JRE外的应用本体相对较大(ACFun 50M,RunFlow 110M)，内存占用较大(ACFun 300M,RunFlow 500M)。

示例：[AcFun](https://www.v2ex.com/t/884920),[RunFlow](https://global.v2ex.com/t/1019060)。

### Flutter

作为Google应对Java官司的plan B，相比plan A(Kotlin)的流行，Flutter显得有些落寞。

Flutter采用Dart语言，从语言来讲存在一些学习成本，但语言本身并不算复杂，按照JS/TS/Java的思维方式来学习，上手很快。

Flutter桌面应用的体验接近原生应用，在文件大小、内存占用上表现合格。

示例：RustDesk,Reqable。

### QT/PyQT/PySide

QT是老牌的跨平台GUI框架，基于C++。

由于采用C++，QT的学习成本较高，只适合有C++经验的人使用。QT的开发效率也明显低于上述其他跨平台框架。

PyQT是QT的第三方Python绑定（同时存在官方绑定PySide），使用Python降低了语言成本。但存在一些缺点：

- 提供的仅仅是绑定，文档、使用模型、示例依赖于原版QT，学习成本较高，开发效率一般
- 打包麻烦，需要裁剪不使用的模块，最小文件大小在20M以上

因此，PyQT的生态位仅限于为Python应用提供GUI。

## Windows

### 官方GUI技术

WIndows的官方GUI开发技术历史上包括：

- Win32 API，采用C语言，提供了底层绘图函数
- MFC/ATL/WTL，采用C++语言，在Win32 API基础上提供了封装的控件
- Windows Form，采用C#语言，提供了组件
- WPF，采用C#语言，提供了基于XML的描述式UI，要求.NET 4.0+（Windows 8开始自带）
- UWP（已淘汰），为引流Windows Phone而搞得一套，随着WP的消亡而消亡
- WinUI（仅支持Windows10较新版本，详情见[链接](https://learn.microsoft.com/en-us/windows/apps/winui/)），支持C#语言或C++语言，提供了Fluent设计风格

_MS基于C#版本的WinUI搞了一个跨平台GUI框架MAUI，目前看来只是一个实验项目。MS基于WinUI还搞了一个Windows React Native，同样也只是一个实验项目。_

WPF示例：滴答清单。

### DirectUI

在Windows上，早期的GUI开发是使用Win32控件，这种开发模式的缺点在于：不够灵活，无法满足开发更复杂界面的需求。

DirectUI抛弃Win32控件，而是采用自绘。

## 参考资料

[MS: windows开发概述](https://learn.microsoft.com/zh-cn/windows/apps/get-started)介绍了主流的WIndows官方GUI框架。<br/>
[Tauri：下一代桌面应用开发框架？](https://www.51cto.com/article/720608.html)<br/>
