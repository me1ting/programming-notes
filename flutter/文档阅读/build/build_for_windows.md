# 底层集成
flutter提供`dart:ffi`库来支持`ffi`编程，提供[win32 package](https://pub.dev/packages/win32)来支持更简单的调用Windows的API。

# 原生UI风格
略

# 自定义Windows托管应用
Windows版本的Flutter应用托管在一个小型的C++应用上，与UI相关的功能包括：

- 初始位置及大小
- 图标
- 应用名称
- 版本号
- 等

你需要修改这部分代码或者用脚本修改/生成相关代码，来满足你的需求。

# 使用VS构建应用
略

# 打包应用
Windows上打包应用的方式有许多，文档介绍了2种方式：

- MSIX
- zip

#Refs
[Building Windows apps with Flutter](https://docs.flutter.dev/development/platform-integration/windows/building)