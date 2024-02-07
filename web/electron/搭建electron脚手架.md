# 搭建electron脚手架

这里使用的包管理器是`yarn`。
## 初始化项目

创建文件夹：

```bash
mkdir demo-project
cd demo-preoject
```

执行初始化，其中需要输入一些信息，也可以后续手动修改配置文件：

```bash
yarn init
```

## 安装electron

如果是局域网，请先配置代理，再执行安装。

```
yarn add --dev electron
```
### （可选）配置代理

我们需要分别设置`yarn`的代理和下载`electron`时的代理，两者都是可选的。

修改配置文件`.yarnrc.yml`，让`yarn`使用代理：

```yml
httpProxy: "http://localhost:1081"
httpsProxy: "http://localhost:1081"
```

设置相关[环境变量](https://www.electronjs.org/zh/docs/latest/tutorial/installation#%E4%BB%A3%E7%90%86)，使得`electron`的安装工具使用代理：

linux/macos:

```bash
export ELECTRON_GET_USE_PROXY=1 && export GLOBAL_AGENT_HTTP_PROXY=http://127.0.0.1:1081 && export GLOBAL_AGENT_HTTPS_PROXY=http://127.0.0.1:1081
```

windows(powershell):

```ps
$env:ELECTRON_GET_USE_PROXY=1
$env:GLOBAL_AGENT_HTTP_PROXY="http://127.0.0.1:1081"
$env:GLOBAL_AGENT_HTTPS_PROXY="http://127.0.0.1:1081"
```

## 填充脚手架内容

最后，我们需要填充脚手架内容，并启动得到一个能正常运行的简单electron应用。

细节参考[tutorial](https://www.electronjs.org/zh/docs/latest/tutorial/)
## 使用Electron Forge

可以使用[Electron Forge](https://electronforge.io/)来搭建脚手架。