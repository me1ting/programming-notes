# 基本概念

## 入口

electron的入口文件是一个`.js`文件，习惯使用`main.js`命名。

## 主进程

所有electron应用存在一个`主进程`，由入口文件定义，并管理整个应用。

主进程的执行环境是`node.js`。

主进程的常见任务之一就是管理窗口。

## 窗口&页面

[窗口](https://en.wikipedia.org/wiki/Windowing_system)是GUI术语，是承载GUI内容的基本单元。

electron应用使用`html页面`来作为窗口内容。

每个窗口运行在独立的进程中，其执行环境是`标准chromium浏览器`，这些进程称为`渲染进程`。

## 预加载脚本

预加载脚本让渲染进程能够访问部分Node.js API。

预加载脚本在渲染进程中执行，且先于页面的加载。

## 上下文桥接

主进程的执行环境`node.js`与渲染进程的执行环境`标准chromium浏览器`都被称为`context`。

这两种context是不同而且独立的，[context-bridge](https://www.electronjs.org/zh/docs/latest/api/context-bridge)模块提供了将`node.js`中的元素暴露给`浏览器`的能力。

## IPC

electron提供了相关模块，支持渲染进程和主进程之间通信，但是渲染进程之间是否可以通信，我还未了解。
