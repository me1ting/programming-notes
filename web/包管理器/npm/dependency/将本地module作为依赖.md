# 将本地module作为依赖

`将本地module作为依赖`具有以下的潜台词：

- 本地的模块化代码是以`module`存在的（如何创建module请参考其它笔记）
- 当前项目依赖该模块化代码的**最新开发版本**（我还没试过版本化的本地module）

使用如下命令将`path`目录下的`module`作为依赖引入当前项目（和安装非本地依赖一样，事实上npm对于`module`的定义很宽松）：

```bash
npm install path
```

编译当前项目时，解析到该dependency时会读取最新的代码进行编译。
