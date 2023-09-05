# 安装flutter

具体细节参考[官方文档](https://docs.flutter.dev/get-started/install/windows)，这里只做步骤记录。

## 下载flutter

目前，flutter采取zip的方式分发，下载并解压`flutter`文件到合适的位置，文档推荐`C:\src\`。

添加`C:\src\flutter\bin`到用户的`path`环境变量中。

## 初始检查

使用命令`flutter doctor`检查flutter sdk的状态。注意：

- `[X] Windows Version (Unable to confirm if installed Windows version is 10 or greater)` 检测方法不兼容非英文语言包而显示错误，实际上没有错误
- `X HTTP host "https://maven.google.com/" is not reachable.` 无法访问Google导致错误

这两个问题不用处理。

## 更新

国内网络需要设置代理：

```powershell
$Env:HTTP_PROXY = "http://127.0.0.1:1081"
$Env:HTTPS_PROXY = "http://127.0.0.1:1081"
```

然后执行更新：

```
flutter upgrade
```