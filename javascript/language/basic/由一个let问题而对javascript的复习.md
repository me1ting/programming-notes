# 由一个let问题而对javascript的复习
## 一个let问题

在逛论坛时看到JS新手的疑惑：

```js
function fn1 (){
    for (let i=0;i<10;i++){
        setTimeout(()=>console.log(i))
    }
}

function fn2 (){
    let i = 0;
    for (;i<10;i++){
        setTimeout(()=>console.log(i))
    }
}

fn1()// 0 1 2 3 4 5 6 7 8 9
fn2()// 10 10 10 10 10 10 10 10 10 10
```

为什么两个函数输出的结果不同。

## 直觉的回答

你可以凭直觉，说原因是一个是使用`块作用域变量`，一个是使用`函数作用域变量`。

直觉并没有什么错，但是它隐藏了许多底层细节，可以说，这是JavaScript后续版本的优点：隐藏了早期版本的设计不合理的地方，用户不需要什么心智负担，就能写出正确的代码。

但是从新手学习的角度，以及真正弄明白问题，我想讲讲更多。

## JavaScript的单线程执行模型与setTimeout

JavaScript程序是单线程执行的，采用的是事件循环模型：一个`执行器`不断地从`任务队列`取出任务并执行。

单线程事件循环模型也支持`异步任务`，但是与多线程执行模型存在不同：

- 执行器按照提交的先后顺序来取任务，而多线程没有这种顺序
- 执行器只有执行完每个任务后（除非任务有异步逻辑来放弃执行），才会取下一个任务，而多线程使用`调度算法`来分配任务的执行，通常会交替执行

[setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)使用一个定时器向任务队列提交任务，如果`delay`参数被省略，表示立即提交。

## 经典问题：闭包在循环中捕获外部变量

本问题是一个经典的闭包编程问题，闭包在循环中捕获外部变量，导致程序的运行结果与想象中可能不一样。闭包在执行时，读取的`i`的值是`i`的当前值，而非一些用户以为的循环时的值。

```js
function fn2 (){
    let i = 0;// 被捕获
    for (;i<10;i++){
        setTimeout(()=>console.log(i))
    }
}
fn2()// 10 10 10 10 10 10 10 10 10 10
```

JavaScript 采用单线程模型，因为循环中没有中断当前执行流的逻辑，因此所有`timeout`处理逻辑只有等循环结束后才能执行，此时 `i` 的值为 `10` ，所以输出`10`共 10 次。

常规的解决办法是使用一个块作用域变量记录循环时的值：

```js
function fn2 (){
    let i = 0;
    for (;i<10;i++){
        let j = i;// 块作用域变量
        setTimeout(()=>console.log(j))
    }
}
fn2() // 0 1 2 3 4 5 6 7 8 9
```

*示例代码3*

但是上面这种解决办法是存在心智负担的，用户必须记住这是可能存在BUG的代码，必须记住怎么解决。

更好的办法是从语言层面进行处理，Java和JavaScirpt分别提供了不同的解决办法。

### JavaScript

我们可以认为，`fn1()`的输出结果所代表的执行逻辑是直观的，没有心智负担的执行模型。JavaScript将示例代码3中的解决方案作为语言层面的默认行为：

>“而在使用 let 声明迭代变量时，JavaScript 引擎在后台会为每个迭代循环声明一个新的迭代变量。 --《JavaScript高级教程》`

```js
function fn1 (){
    for (let i=0;i<10;i++){
        //每次循环捕获的 i 都是独立的
        setTimeout(()=>console.log(i))
    }
}

fn1() // 0 1 2 3 4 5 6 7 8 9
```

根据JavaScript的单线程执行模型，`setTimeout()`立即提交任务队列，但只有循环结束后才执行，顺序提交，顺序执行，顺序输出。

### Java

Java要求被捕获的变量必须是 `final` 或者等价 `final` 的：

```java
for (int i = 0; i < 10; i++) {
    int num = i;// 这里使用一个等价 final 的块作用域变量
    new Thread(() -> System.out.println(num)).start(); // 0 9 8 7 5 3 4 2 6 1
}
```

需要刻意的使用容器，比如数组，来实现第二种的效果，因为Java是多线程语言，子线程与主线程是并发执行，输出结果不全是`10`：

```java
final int[] ref = {0};
for (int i = 0; i < 10; i++) {
    new Thread(() -> System.out.println(ref[0])).start();// 3 4 4 3 8 6 10 10 10 10
    ref[0]++;
}
```

### Golang

#### 1.21及其之前

Go没有在语言层面进行处理，但是IDE或者语言服务器实现会进行提示。

```go
func main() {
	for i := 0; i < 10; i++ {
		go func() {
			fmt.Println(i)//IDE或者LS会提示问题
		}()
	}
    // 6 9 8 6 9 10 10 10 10 6
	time.Sleep(time.Second * 5) //wait goroutines end
}
```

#### 1.21及其之后

Go使用了与JS相同的解决办法：

```go
func main() {
	for i := 0; i < 10; i++ {
		go func() {
			fmt.Println(i)//IDE或者LS会提示问题
		}()
	}
    // 0 1 2 3 4 5 6 7 8 9
	time.Sleep(time.Second * 5) //wait goroutines end
}
```
## JS的历史：var与let

JavaScirpt是几天内设计并实现的一门编程语言，所以存在许多设计缺陷，在ES6中进行了许多修补。就比如使用`let`取代`var`。

ES5只有全局作用域和函数作用域，直到**ES6通过let提供了块作用域**。

```java
function fn2 (){
    let i = 0;
    for (;i<10;i++){
        var j = i;// 函数作用域变量
        setTimeout(()=>console.log(j))
    }
}
fn2() // 9 9 9 9 9 9 9 9 9 9
```

## 异步给JavaScript执行模型带来的挑战

JavaScript后续版本支持`async`,`await`，这使得传统的执行流可以被“中断”，进入下一个事件循环：

```js
const fn2 = async () => {
    let i = 0;
    for (; i < 10; ) {
        setTimeout(() => console.log(i))
        i = await plusOne(i)
    }
}

function plusOne(n){
    return new Promise(function(resolve, reject) {
    setTimeout(() => {
        resolve(n+1)
    },1)
})
}

fn2() // 0 1 2 3 4 5 6 7 8 9
```

## 参考资料

《JavaScript高级程序设计》 v4