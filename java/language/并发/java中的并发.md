# 并发是OS领域的概念

`并发`是OS领域的概念，在学习Java中的并发时，具备领域知识是更有效率的学习方式，否则你很容易被特定语言、特定框架的封装给搞昏了头脑，抓不住重点。

本篇笔记不会重述基本的并发相关知识，包括：`线程`、`同步`、`异步`、`阻塞`等等。而重点关注，Java封装的并发是怎么样的。

# 线程

## 线程模型

在主流平台（Windows,Linux,macOS）上的Oracle JDK，采用的是对系统原生线程的1:1封装。

## 线程的状态

Java给线程定义了6种状态：

![](Pasted%20image%2020230630204157.png)

这6种状态在`Thread.State`中定义。注意的是，正如[文档](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.State.html)所说的，这些状态只是JVM内部状态，并不能反映系统线程的状态。

这6种状态中：

- `阻塞` 线程等待监视器锁时的状态

>为了避免歧义性，在本笔记中，除非明确使用`阻塞状态`时才表示（Thread.State中定义的）狭义的含义，否则`阻塞`一词用于描述线程/调用等待资源的状态

## 中断线程

Java中的线程可以被中断，通过调用`thread.interrupt()`实现，所在线程可以使用`isInterrupted()`来查询是否被中断。

发明中断的目的，是让外部可以通知线程do something else。为了通知被阻塞的线程，会触发 `InterruptedException`。

## 线程的属性

一些线程相关的概念要么过时，要么很少被使用，用到时再了解：

- 优先级
- 线程组
- 未捕获异常处理器
- 守护线程

# 同步语法

## 监视器锁

监视器锁是Java1.0时代引入的，每个对象都拥有的内部锁。监视器锁由于缺陷明显（不支持多个条件变量），因此被认为是过时的设计。但因为兼容性原因，我们不得不学习它。

### `synchronized`关键字

`synchronized`关键字，可以用来定义同步函数/同步静态函数/同步代码块，其使用的是函数所在对象/类对象/选定对象的内部锁。

```java
class Demo{
	public synchronized method1(){}//函数所在对象的内部锁
	public static synchronized method2(){}//类对象的内部锁
	public method3(){
		synchronized(this){//自定义对象的内部锁
			//临界区
		}
	}
}
```

### 内部条件变量

每个对象的内部锁存在一个条件变量：

```java
class Demo {
	public synchronized method1(){
		this.wait();//在内部锁的条件变量上休眠
		this.notifyAll();//在内部锁的条件变量上唤醒其它休眠线程
	}
}
```

条件变量的相关方法是定义在`Object`类型上的。

## volatile域

在C/C++/C#/Java中都有[volatile](https://en.wikipedia.org/wiki/Volatile_(computer_programming))关键字，但是它们的作用存在差异，这里只关注Java中的volatile关键字。

在Java中，`volatile`用于修饰共享变量，保证多线程环境下共享变量的`可见性`。

>有关volatile的细节参考《java并发编程实战》笔记

# 基础同步工具

### juc提供的锁与条件变量

内建的监视器存在许多缺点，`java.util.concurrent`是Java后续版本增加的同步类库，其提供的锁与条件变量可以替代监视器及其关联的条件变量。

### ThreadLocal

一些场景，我们需要一个容器能为不同的执行线程提供与线程绑定的对象，ThreadLocal就是这样一个容器。

## 原子类

对于基本类型，比如int，`i++`或`++i`操作并非线程安全。我们需要提供类似方法的线程安全的版本，这些类被称为原子类。

原子类的方法是线程安全的，但是通常不是通过锁实现，而是直接使用底层硬件原语。

# 线程安全的集合

实现线程安全的集合需要领域专家来编写，在Java中，我们可以使用JUC提供的一系列线程安全集合。

# Callable&Future接口

Callable是JUC提供的任务抽象，相比Runnable，可以拥有返回值。Future是对异步任务结果的抽象。

# 线程池

JUC提供了线程池抽象和基本实现。

# 高级同步工具

JUC提供了一些高级同步工具：Semahore,CyclicBarrier...

# 参考资料

《Java核心技术 卷1》v10 14. 并发<br/>
《onjava8》24. 并发编程<br/>
《onjava8》附录：低级并发机制<br/>