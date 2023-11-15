# 概览

虽然`同步`和`异步`是相对的关系，但对主流编程语言来说，`同步`执行是自然的、默认的，而`异步`执行是附加的、需要理解的、难以掌握的（或者说容易忘记的）、需要显式说明的。

本文将复习同步和异步的基本概念，然后讲讲JavaScript的异步执行模型（指相关语法、API以及逻辑抽象）。

# 复习：同步和异步

`同步`和`异步`概念属于操作系统领域知识，这里只是简单的进行粗浅的复习。

`同步`是指程序按照编写顺序、调用顺序一行接一行的执行；而`异步`是打破这种简单模型，存在多个执行流，它们之间的相对执行顺序是无法预料的。

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

> 《understanding es6》使用术语`事件模型`和`回调模式`，以此区分API中的细粒度不同的接口，两者底层都是事件轮询机制，API都使用了callboack。两者唯一的区别只是细粒度的不同：前者暴露了事件本身，且允许一对多。
>
> 比如DOM的`onclick`是回调模式，需要将处理函数赋值给DOM的`onclick`。而[addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)是事件模型，需要注册，并允许多个处理函数同时注册。

### callback的缺点

在使用JS/TS完成一些实际项目后，对“回调地狱”有了一点体验：

- callback是对事件执行结果进行处理的异步执行逻辑
- 在编写代码时经常出现层层callback嵌套的情况，这是受限于语言的表达能力，这种模式无论是编写代码还是阅读代码都让人不太舒服。

## 新模型：Promise+异步函数

### Promise(ES6)

ES6中首先添加了`Promise`，来对异步执行进行抽象。`Promise`是一个通用术语，它有相关的论文支持，但这并不重要，它也可以叫其它名字，比如Java中的`Future`。

> 并不能完全等价，因为Promise有独特的原语来满足某些需求。

`Promise`使得原本需要传递`callback`的函数，现在只需要返回`Promise`对象，由调用方自己对结果进行处理。这使得我们不再需要面对`回调地狱`，代码结构变得清晰简洁了许多。

### 异步函数(async/await语法)(ES8)

对`Promise`的结果进行处理，依然是使用回调模式。

而ES8添加的`异步函数`使得可以以同步的方式编写异步执行代码，语法上使用`async/await`。

#### async

`async`使得一个函数（也可以是一个箭头函数、方法）具有**异步特征**，这样的函数称为`异步函数`。从语法上来讲，异步特征就是：

- 返回值会被自动包装为一个Promise
- 内部允许使用`await`

```javascript
async function foo() {}
```

#### await

`await`等待一个`Pormise`关联的异步执行逻辑执行完成，它会暂停当前的执行流。如果Promise被兑现，那么执行流继续执行；如果Promise被拒绝，将终止该异步执行流（以抛出`Error`的方式）。

语法上，`await`只能在异步函数内使用。

### 模拟协程

`协程`是对单线程程序的并行划分，支持`Promise`（或类似抽象）与`async/await`语法的现代语言都提供了这样的抽象，但JavaScript并没有。在阅读《JavaScript高级程序设计4》时，里面较多的使用了`setTimeout`函数，从添加新的异步执行流来讲，这与`协程`并没太大区别。

```javascript
let task = ()=>{
  console.log("hello world");  
};
setTimeout(task, 0);
```

# 总结

本文大致梳理了一下JavaScript的异步执行模型，从同步/异步的概念，再到JavaScript的基本执行模型，callback机制，然后是Promise抽象，异步函数（async/await语法）概念。

Promise和异步函数是编程语言目前最新的、最流行的异步编程模型，理解JavaScript中的它们，也有助于学习其它语言的异步编程。

# 参考资料

《JavaScript高级程序设计4》11. 期约与异步函数

《understanding es 6》 11. Promise与异步编程
