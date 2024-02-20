# 概览

`Promise`是JavaScript异步模型中的一个重要概念，因此单独细讲。

# Promise的状态

Promise有三种状态：

- `Pending` 待定
- `Resolved` 解决
- `Rejected` 拒绝，关联着一个`error`

最初始的状态是`Pending`，最终状态是`Resolved`或`Rejected`。Promise的状态是根据异步逻辑的执行结果异步更新的，属于内部实现，无法通过API访问。

# 使用Promise

## promise.then()

`promise.then()`方法用于（*在同步代码中*）**注册异步代码的执行结果的处理函数**，这些处理函数是异步执行的。

> 异步指的是**代码块**之间的并行执行关系，在代码块中，前后语句依然是按照同步顺序执行的。

`执行结果`可能成功，也可能失败，promise.then()通常有3种使用方式：

```javascript
const promise = doSomething();
// 同时提供解决和拒绝的处理函数
promise.then(successCallback, failureCallback);
// 仅提供解决的处理函数
promise.then(successCallback);
// 仅提供失败的处理函数，一般使用catch(failureCallback)这种缩略形式
promise.then(null, failureCallback);
```

## promise.catch()

`promise.catch(failureCallback)`是`promise.then(null, failureCallback)`的缩略形式。

## promise.finally()

`promise.finally()`表示最终执行的代码。

## promise的链式调用

`promise.then`的返回值是一个新的`Promise`对象，一些细节值得注意：

- 返回一个新的Promise，**表示前一个结果处理操作的异步执行结果**
- 新Promise的`Resolved`状态表示前一个异步操作成功（未抛出错误）
- 新Promise的`Rejected`状态表示前一个异步操作失败（前前一个异步操作的拒绝状态未处理，或前一个异步操作抛出新的错误）
- 也就是说，**如果未处理拒绝状态结果，那么错误会沿着链条传递**

一个典型的链式调用范例代码：

```javascript
doSomething()
.then(result => doSomethingElse(result))// doSomethingElse 返回 newResult
.then(newResult => doThirdThing(newResult))// doThirdThing 返回 finalResult
.then(finalResult => console.log(`Got the final result: ${finalResult}`))
.catch(failureCallback);
```

其对应的`async`函数提供了更清晰了表达：

```javascript
async function foo() {
  try {
    const result = await doSomething();
    const newResult = await doSomethingElse(result);
    const finalResult = await doThirdThing(newResult);
    console.log(`Got the final result: ${finalResult}`);
  } catch(error) {
    failureCallback(error);
  }
}
```

# 创建Promise

## 编写返回Promise的函数

首先看一段示例代码：

```javascript
let fs = require("fs");

//对Node.js的基于回调的异步操作`fs.readFile()`的Promise封装
function readFile(filename) {
	return new Promise(function(resolve, reject) {
		// 触发异步任务
		fs.readFile(filename, { encoding: "utf8" }, function(err, contents) {
			// 检查错误
			if (err) {
				reject(err);
				return;
			}
			// 读取操作成功
			resolve(contents);
		});
	});
}

// 同时监听 fulfillment 和 rejection
readFile("example.txt").then(function(contents) {
		// fulfillment
		console.log(contents);
	}, function(err) {
		// rejection
		console.error(err.message);
});
```

# Promise与异步函数

假设我们要编写一个判断函数，初始化完成（window.main存在）：

```js
async function waitUntilPresent(getter) {
   while (getter() === undefined) {
      await new Promise(r => setTimeout(r, 100));//sleep 100ms
   }
   return getter();
}
```

1) async函数里面是可以使用Promise的，但是一般情况下很少这样做，除非像上面这样创建然后立即await的特例
2) 一些场景下没法完全使用async取代手搓Promise，比如上面实现sleep功能

而我们在调用上面创建的函数时，又有两种风格：

```js
/* node.js */
const window = {};

setTimeout(() => {
   window.main = "hello";
}, 1000);
/* node.js */

waitUntilPresent(()=>window.main).then(main => {//以回调的方式触发处理函数
   console.log(main);
});

// 以同步代码的方式处理
await waitUntilPresent(()=>window.main);
console.log(window.main);
});
```

区别在于是否阻塞当前任务。

# 总结

`Promise`是异步执行操作在同步代码中的**占位符**，相比以前的异步模型，其最大的特点是灵活性。

我们可以使用`then()`,`catch()`来以回调的方式处理异步执行逻辑的结果；也可以使用`await`来将异步操作嵌入同步代码中，得到异步函数。

# 参考资料

[MDN Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
[MDN 使用Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)