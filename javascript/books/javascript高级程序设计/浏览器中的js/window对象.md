# window对象

浏览器中的window对象是`Global`的代理。

## 额外的window方法

window提供了一些额外的方法（或者说全局函数）。

### btoa

[btoa](https://developer.mozilla.org/en-US/docs/Web/API/btoa)用于base64编码。需要注意，一般的base64编码函数接收bytes，但该函数接收一个字符串参数，字符串的每个码元当作byte来用。这**是一种怪异的API设计**，但可以理解，因为JavaScript缺少底层数据类型的抽象。

可以使用`String.fromCharCode(...number[])`方法用来将number[]转换为满足以上要求的字符串参数。

```js
//需要使用如下的样板代码对u8array进行base64编码
const code = btoa(String.fromCharCode(...compressed));// compressed的类型是u8array
```

总而言之，这是一个设计糟糕的API。