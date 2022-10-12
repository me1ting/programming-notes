# 安装yarn
在较新的版本(Node.js >=16.10)中，`yarn`是内建在node.js安装包中，我们只需要开启相关功能。

使用管理员权限执行：
```bash
corepack enable
```

# 脚手架
## 使用yarn初始化项目
创建文件夹：
```bash
mkdir demo-project
cd demo-preoject
```
执行初始化，其中需要输入一些信息，也可以后续手动修改配置文件：
```bash
yarn init
```

## 更新项目使用的yarn到稳定版本
推荐将`yarn`更新到稳定版本：
```bash
yarn set version stable
```

## 安装electron
### （可选）配置网络
在局域网中使用包管理器是一个巨大的挑战，特别是`node.js`环境下，因为`node.js`的许多包只是一个壳，实际安装还需要访问网络，这个过程是不受`npm`或`yarn`控制的。

首先，我们需要修改配置文件`.yarnrc.yml`，让`yarn`使用代理：
```yml
yarnPath: .yarn/releases/yarn-3.2.3.cjs
httpProxy: "http://localhost:1081"
httpsProxy: "http://localhost:1081"
```

其次，我们需要设置相关[环境变量](https://www.electronjs.org/zh/docs/latest/tutorial/installation#%E4%BB%A3%E7%90%86)，使得`electron`的安装工具使用代理：

```bash
export ELECTRON_GET_USE_PROXY=1 && export GLOBAL_AGENT_HTTP_PROXY=http://127.0.0.1:1081 && export GLOBAL_AGENT_HTTPS_PROXY=http://127.0.0.1:1081
```

*注意的是，这里的代理存在兼容性问题，我自己写的http代理就存在这个问题，最好使用privoxy来提供代理服务*

最后我们使用`yarn`来执行安装：

```bash
yarn add --dev electron
```

## 填充脚手架内容
最后，我们需要填充脚手架内容，并启动得到一个能正常运行的简单的electron应用。

主要参考资料是[tutorial](https://www.electronjs.org/zh/docs/latest/tutorial/)

脚手架内容主要包括：

- 应用文件
- .gitignore

这里我将脚手架文件进行了整理，保存在`脚手架文件`文件夹中。

需要对`package.json`做出两处修改：

- `main`，匹配我们真实的入口js
- `scripts`，添加`start`命令

```json
{
  "name": "demo-porject",
  "version": "1.0.0",
  "main": "main.js",
  "repository": "https://github.com/xxx/demo-porject",
  "author": "xxx",
  "license": "MIT",
  "packageManager": "yarn@3.2.3",
  "devDependencies": {
    "electron": "^21.0.1"
  },
  "scripts": {
    "start": "electron ."
  }
}
```

执行`yarn start`，预期将执行一个最基础的electron程序。