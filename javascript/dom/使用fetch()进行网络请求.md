# 使用fetch

[fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/fetch)是`DOM`（浏览器）提供的XHR API，用来取代`XMLHttpRequest`，相比后者而言，API更加简洁，且支持`Promise`。

Axios比较流行，但是一些场景可能使用原生API更容易，比如`chrome extension`这种很特殊的使用场景。
## feach函数

fetch函数用于发起HTTP请求：

```js
fetch(resource)
fetch(resource, options)
```

`resource` 一般使用字符串。一些常用的模式包括：

### 使用POST方法提交二进制数据

```js
data = ...;// u8array，支持很多类型
fetch("/upload",{
    method: "post",
    body: data
})
```

## Response类型

`fetch`函数的返回值是`Promise<Response>`。Response可以被进一步解析为特定数据：

- `resp.json()`返回一个`Promise<object>`，解析为json数据
- `resp.text()`返回一个`Promise<string>`，解析为文本数据
- ...

## 参考资料

[Introduction to fetch()](https://web.dev/introduction-to-fetch/)