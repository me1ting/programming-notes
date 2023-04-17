# 前言
[fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/fetch)是`DOM`（浏览器）提供的XHR API，用来取代`XMLHttpRequest`，相比后者而言，API更加简介，且全面支持`Promise`。

>DOM端的XHR是一个`受限的`支持HTTP1.1语义的HTTP Client，即使存在`Axios`这样的跨浏览器、nodejs的统一框架，但前后端的HTTP Client本质上还是存在一些区别，这值得注意。

虽然我用Axios较多，但是一些场景可能使用原生API更容易，比如因为`JavaScript`现在糟糕的模块系统，导致使用外部库编译出错，又比如`chrome extension`这种很特殊的使用场景。

# feach函数
```js
fetch(resource)
fetch(resource, options)
```
`resource` 一般使用字符串。一些常用的模式包括：

## post提交二进制数据
```js
data = ...;// u8array，支持很多类型
fetch("/upload",{
    method: "post",
    body: data
})
```

# Response
`fetch`函数的返回值是`Promise<Response>`。Response可以被进一步解析为特定数据：

- `resp.json()`返回一个`Promise<object>`，其结果是一个对象
- `resp.text()`返回一个`Promise<string>`
- ...

# Refs
[Introduction to fetch()](https://web.dev/introduction-to-fetch/)