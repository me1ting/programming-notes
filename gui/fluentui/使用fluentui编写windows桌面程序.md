# 使用fluent ui编写windows桌面程序

使用web技术编写桌面软件已经成为了一个接受度越来越高的方案，包括electron,tauri,wails等。

对于不是专业前端的人员来说，编写GUI界面的一个好的方法是使用现有的GUI库，当前前端主要有以下成熟的UI以及库：

- fluent ui，实现包括MS官方的react fluentui
- material ui，实现包括mui(react)和Vuetify(vue)
- ant design(react),element ui(vue)

## 为什么不选择material ui？

`material ui`是Google为Android所设计的，个人曾经使用过`Vuetify`，也去看过mui的组件，个人的看法是material ui的组件并不符合桌面（特别是Windows）使用者的使用习惯。

比如`material ui`的input组件就不太适合桌面。

![](Pasted%20image%2020231223222019.png)

*除了这个组件，其余组件其实还好*

## 为什么不选择 ant design或者element ui？

这两个都是国内公司出品的，面向的桌面端网页后台管理系统。特点是功能丰富，文档友好。他们的风格与桌面应用的适配度比material ui要高。他们的缺点是对于中小型应用来说较重。

## 为什么选择fluent ui？

选择fluent ui，主要有以下原因：

- 面向Windows应用设计，是Windows原生风格
- `react fluent ui`在MS的实际桌面产品（Teams等）中应用

## fluent ui的相关站点

通过以下站点学习和使用fluent ui：

- fluent ui [github](https://github.com/microsoft/fluentui)
- react fluent ui [官方文档](https://react.fluentui.dev/)
- 第三方fluent icon [选择器](https://fluenticons.co/)