# 安装Flutter

具体细节参考[官方文档](https://docs.flutter.dev/get-started/install/windows)，这里只做步骤记录。

## 下载Flutter

目前，Flutter采取zip的方式分发，下载并解压`flutter`文件到合适的位置，如`C:\flutter\`。

添加`C:\src\flutter\bin`到`path`环境变量中。

## 初始检查

使用命令`flutter doctor`检查Flutter SDK的状态。其中：

- `[X] Windows Version (Unable to confirm if installed Windows version is 10 or greater)` 在低Windows版本中出现，可忽略
- `X HTTP host "https://maven.google.com/" is not reachable.` 无法访问Google导致错误，可忽略

## 更新

局域网内需要设置代理：

```powershell
$Env:HTTP_PROXY = "http://127.0.0.1:1081"
$Env:HTTPS_PROXY = "http://127.0.0.1:1081"
```

然后执行更新：

```powershell
cd C:\flutter
flutter upgrade
```
