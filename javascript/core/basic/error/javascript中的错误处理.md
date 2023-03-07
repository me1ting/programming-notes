# 概览
ECMA-262 v3就添加了`try-catch`语法，但这个语法对于我而言是很陌生的，事实上在早期前端项目用到错误处理的地方并不多，在前端工程化和异步函数引入后，错误处理的使用需求才多了起来。

# 语法细节

## try-catch-finally语法
与主流语言的`try-catch-finally`语法并没有太大区别，这里就不赘述了。

注意的是，目前的ES标准还没有类似Java中的`try-catch-catch...`这样根据error的不同类型来划分处理逻辑的语法。

>毕竟对于ES来说，class并不是一个必须的属性

## 错误类型
ES并没有规定错误必须是某个类型，错误可以是任意类型，习惯上使用`message`字段来承载错误信息。

ES预定义了一些错误类型，来供ES和应用开发者使用：

- Error
- RangeError
- ...（参考《JavaScript高级程序设计》v4 21.2.3 2.错误类型）

# 浏览器端的错误处理
对于未被应用所捕获而处理的错误，浏览器默认会在控制台显示这些错误。

# Effective错误处理
大概是Java版本的重复叙述吧，其实所有语言的错误处理经验并没有太大的区别，除非某些因为语言的特殊语法而产生的相关经验。

细节可以看看《JavaScript高级程序设计》相关内容。

# Refs
《JavaScript高级程序设计》v4 第21章 错误处理与调试

[MDN: try..catch](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch)