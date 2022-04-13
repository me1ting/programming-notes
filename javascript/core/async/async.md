# 概览

虽然`同步`和`异步`是同等的关系，但对于目前世面上的编程语言来说，`同步`执行是自然的、默认的，而`异步`执行是附加的、需要理解的、难以掌握的（或者说容易忘记的）、需要显式说明的。

本文将复习同步和异步的基本概念，然后讲讲JavaScript的异步执行模型（指相关语法、API以及逻辑抽象）。

# 复习：同步和异步

`同步`和`异步`概念属于操作系统领域知识，这里只是简单的进行粗浅的复习。

`同步`是指程序按照编写顺序、调用顺序一行接一行的执行；`异步`就是打破这种简单模型，存在多个执行流，它们之间的相对执行顺序是无法预料的。

# JavaScript的异步执行模型

正如概览中所说，目前世面上的主流语言都是将`同步`作为默认的执行方式，`异步`就像是`同步`上的一层狗皮膏药，一层不太顺眼的补丁一样，让人难以理解，JavaScript也不例外。

## 经典执行模型：不支持多线程，无阻塞，通过事件轮询支持异步执行

由于诞生之初的运行环境是浏览器，JavaScript被设计为**单线程执行**，且**无阻塞**（该术语一般用来描述IO操作）。

JavaScript通过**事件轮询机制**支持异步执行，语法层面使用**callback**（回调）的形式。

> 多线程和事件轮询是实现异步执行的两种模型，属于操作系统领域知识。

一个使用callback的示例代码：

```javascript
function double(value, callback) {
	setTimeout(() => callback(value * 2), 1000);
}
```

> 《understanding es6》使用术语`事件模型`和`回调模式`，以此区分API中的细粒度不同的接口，但其实没这必要，因为这两者底层都是事件轮询机制，API都使用了callboack。两者唯一的区别只是细粒度的不同：是否需要将事件暴露出来，是否存在一对多的关系。
>
> 比如DOM的`onclick`就是一个命名的事件，无论是将处理函数赋值给DOM的`onclick`，还是通过[addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)注册处理函数，事件处理函数都是一个`callback`。
>
> 而`setTimeout()`并没有暴露事件本身，但底层依然有一个`timoutHanppend`事件（逻辑上来讲，不是指实际代码），而`setTimeout()`的主要参数依然是一个处理函数，是一个`callback`。

### callback的缺点

个人没写过什么复杂的JavaScript代码，因此没有对callback存在刻骨铭心的不便的地方，但大概可以理解“回调地狱”：

- callback是对事件执行结果进行处理的异步执行逻辑
- 在编写复杂代码时很可能出现层层callback嵌套的情况，这种为异步执行而进行的代码强制拆分不够优雅，导致代码编写困难，理解困难。

## 新模型：Promise+异步函数

由于没深入使用过`Promise`和`异步函数`，这里仅仅从概念的角度，来记录一下自己对它们的理解。

### Promise(ES6)

> Promise是同步对象（在同步模型中使用），但也是异步执行模式的媒介。
>
> -《JavaScript高级程序设计4》

`Promise`是对异步执行的抽象，是一个通用术语，它有相关的论文支持，但这并不重要，它也可以叫其它名字，比如Java中的`Future`。

> 并不能完全等价，因为Promise有独特的原语来满足某些需求。

### 异步函数(async/await语法)(ES8)

`异步函数`使得可以以同步的方式编写异步执行代码，语法上使用`async/await`。

#### async

`async`使得一个函数（也可以是一个箭头函数、方法）具有**异步特征**，这样的函数称为`异步函数`。具体来讲，就是其返回值会被自动包装为一个Promise。

```javascript
async function foo() {}
```

#### await

`await`等待一个`Pormise`关联的异步执行逻辑执行完成，它会暂停当前的执行流。如果Promise被兑现，那么执行流继续执行；如果Promise被拒绝，将终止该异步执行流。

语法上，`await`只能在异步函数内使用。

### 模拟协程（待验证）

`协程`是对单线程程序的并行划分，支持`Promise`（或类似抽象）与`async/await`语法的现代语言都提供了这样的抽象，但JavaScript并没有。在阅读《JavaScript高级程序设计4》时，里面较多的使用了`setTimeout`函数，从添加新的异步执行流来讲，这与`协程`并没太大区别。

```javascript
let task = ()=>{
  console.log("hello world");  
};
setTimeout(task, 0);
```

# 总结

本文大致梳理了一下JavaScript的异步执行模型，从同步/异步的概念，再到JavaScript的基本执行模型，callback机制，然后是Promise抽象，异步函数（async/await语法）概念。

Promise和异步函数是编程语言界当前最新的、流行的异步编程模型，理解JavaScript中的它们，也有助于学习其它语言的异步编程。

# Ref

《JavaScript高级程序设计4》11. 期约与异步函数

《understanding es 6》 11. Promise与异步编程
