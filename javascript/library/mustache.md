# FAQ
## 如何关闭对html元素的转义？
如果只是临时的关闭，使用：
```
{{{content}}}
```
如果需要全局关闭：
```js
// disable xml/html escape
Mustache.escape = function (value) {
    return value;
};
```