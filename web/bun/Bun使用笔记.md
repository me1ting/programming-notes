# Bun使用笔记

## 安装

### linux

参考[官方文档](https://bun.sh/docs/installation)，在局域网使用`curl`获取安装脚本时，由于网络问题，进度很慢。可以使用`npm`来进行安装，bun开发商将自己打包到了npm，因此是一个独立的下载源，甚至可以使用npmmirror进行加速。

## 使用

### bun install 挂住的问题

目前来看是网络以及bun自己的问题，可以`Ctrl+C`多尝试几次。