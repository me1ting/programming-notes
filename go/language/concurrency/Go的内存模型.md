# Go的内存模型

## 基本概念

Go的`内存模型`规定了在一个 goroutine 读取共享变量时能够保证观测到其它`goroutine`写入的值的状况(condition)。

`数据竞争`：在未全部使用`sync/atomic`原子访问的情况下，对内存某个位置的写入存在同时对该位置的写入或读取。

## 内存模型的形式化定义

这部分内容是通过拓扑学术语定义的，需要背景知识，因此这里只能勉强理解。

`synchronized before`术语表示：如果 写操作 w `synchronized before` 读操作 r ，那么写操作 w 被读操作 r 观察到，且写操作 w 是读操作 r 之前最后一个写入该内存位置的写操作。

`happens before`术语是同步保证：如果 w `happens before` r，那么`w synchronized before r`或者`w happens before w' which w' is synchronized before r`。

## 编写无数据竞争的程序

由于编译器实现、CPU实现的所带来的复杂性，数据竞争的结果是不确定的，应当避免编写数据竞争的程序。

对于存在写入的共享数据，应当使用Go的同步机制进行同步处理，确保无数据竞争。

## Go中的同步

### init()函数

所有`init()`函数由一个 goroutine 执行，但是init()可能会创建额外并发执行的 goroutine。

被依赖的包，它的`init()`函数`happens before`引入它的包的`init()`函数。

所有`init()`函数 `happens before` 在main包的`main()`函数。

### goroutine

`go`语句`happens before` 其创建的 goroutine 。

```go
var a string

func f() {
	print(a)
}

func hello() {
	a = "hello, world"// 保证该操作在f()执行之前发生
	go f()
}
```

退出 goroutine 不做任何同步保证。

### channel

通道是go主要的同步方法。

通道上的发送操作 synchronized before 接收操作完成。

通道的关闭操作 synchronized before 因为通道关闭而返回零值的接收操作。

### Mutex、RWMutex、Once

略

## 参考资料

[doc: 内存模型](https://go.dev/ref/mem)
