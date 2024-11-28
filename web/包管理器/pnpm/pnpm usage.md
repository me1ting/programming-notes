# pnpm usage

## 本地依赖

按照[文档](https://pnpm.io/cli/add#install-from-local-file-system)，使用如下方式添加本地依赖：

```
pnpm add ./some-directory
```

注意，本地依赖实际上是依赖本地项目的**构建内容**，当你调用`pnpm build`时，它并不会链式调用`pnpm build`来编译其所依赖的本地项目，这意味着你需要手动编译被依赖的本地项目。

## 网络问题

npm注册表在2024年被局域网屏蔽，需要解决网络问题。有两种办法：

- 基于代理，仅限本地使用
- 基于镜像，适用于本地和云服务器

代理基于常用的`HTTP_PROXY`和`HTTPS_PROXY`环境变量，参考其它笔记。

镜像参考[该链接](https://juejin.cn/post/7245838232012488764)，相关命令如下：

```shell
# 查询下载源
pnpm get registry
# 设置为国内镜像
pnpm config set registry https://registry.npmmirror.com
# 设置为官方镜像
pnpm config set registry https://registry.npmjs.org/
```

注意：`npmmirror`同步频率较慢（可能超过一小时），当你将包发布到npm注册表时，需要等待较长的时间才能在镜像上找到最新版本。