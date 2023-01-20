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

`promise.then()`方法用于（*同步代码中*）**注册异步代码的执行结果的处理函数**，这些处理函数是异步执行的。

> 异步指的是**代码块**之间的并行执行关系，在代码块中，前后语句依然是按照同步顺序执行的。

## promise.catch()

`promise.catch()`方法用于（同步代码中）注册异步代码的执行结果为`Rejected`的处理函数，该处理函数是异步执行的。

## promise的链式调用

`promise.then`和`promise.catch`的返回值是一个新的`Promise`对象，一些细节值得注意：

- 返回一个新的Promise，**表示前一个结果处理操作的异步执行**
- 新Promise的`Resolved`状态表示前一个异步操作成功（未抛出错误）
- 新Promise的`Rejected`状态表示前一个异步操作失败（前前一个异步操作的拒绝状态未处理，或前一个异步操作抛出新的错误）
- 也就是说，**如果未处理拒绝状态结果，那么错误会沿着链条传递**

看`axios`的的demo，一个典型的链式调用范例代码：

```javascript
// Make a request for a user with a given ID
axios.get('/user?ID=12345')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {//上一个结果处理操作未处理拒绝状态，会传递下去
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
```



# 创建Promise

## 编写返回Promise的（同步）函数

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

let promise = readFile("example.txt");
// 同时监听 fulfillment 和 rejection
promise.then(function(contents) {
		// fulfillment
		console.log(contents);
	}, function(err) {
		// rejection
		console.error(err.message);
});
```

有一点可能难以理解：创建`Promise`时的形式参数`resolve,reject`与调用`promise.then`中的实际参数`resolve,reject`是什么关系？

虽然没有看过相关资料，以及底层实现，但不难以判断：

- 调用`readFile`，执行了`new Promise()`，返回了一个`Promise`对象
- 执行`new Promise()`时，向任务队列添加了一个任务：执行该匿名函数，其实际参数`resolve,reject`将接收的实际参数`err,contents`保存在返回的`Promise`对象中
- 调用`promise.then`向任务队列添加了一个任务：当`promise`对应的异步操作执行完成时，执行结果处理函数
- 执行结果处理函数的实际参数为Promise对象中保存的值

## 将结果包装为Promise

//more

# 总结

`Promise`是异步执行操作在同步代码中的**占位符**，相比以前的异步模型，其最大的特点是灵活性。

我们可以使用`then()`,`catch()`来以回调的方式处理异步执行逻辑的结果；也可以使用`await`来将异步操作嵌入同步代码中，得到异步函数。