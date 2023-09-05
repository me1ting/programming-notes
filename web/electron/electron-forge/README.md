# 使用WiX进行打包

虽然electron forge不推荐这种打包方式，但是如果不需要自动更新，这种打包方式比使用`squirel`更好。

根据[文档](https://www.electronforge.io/config/makers/wix-msi)添加一个maker。

安装依赖：

```bash
npm i --save-dev electron-wix-msi
```
或：

```bash
yarn add -D electron-wix-msi
```

这个工具依赖于`Wix toolkit 3`，需要[下载](https://github.com/wixtoolset/wix3/releases/tag/wix3112rtm)并添加到PATH中：

```powershell
$Env:PATH += ";E:\Builds\wix311-binaries"
```