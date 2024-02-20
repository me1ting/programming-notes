# 前言

《TGPL》是学习Go，以及作为文档的一本好书，但其基于Go 1.4版本。本文记录了Go 1.4版本后，**语法**和**工具链**的重要变更。

## 1.5

### 内部包

Go从本版本开始完全支持[内部包](https://docs.google.com/document/d/1e8kOo3r51b2BWtTs_1uADIA5djfXhPT36s6eHVRIvaU/edit)。在Go的之前使用模型中，包并不提供任何访问权限的控制。而内部包提供了局部的`包级别`访问权限：

如*`$GOPATH/src/mypkg/internal/foo`只能被`$GOPATH/src/mypkg`包访问*

## 1.9

### 类型别名

这是一个新的语法，[类型别名](https://go.dev/doc/go1.9#language) 是创建类型的别名，而非创建新的类型：

```go
type T1 = T2
```

## 1.13

### 数字字面量

引入了新的数字字面量语法：

- 二进制整数前缀：`0b1011`,`0B1011`

- 八进制整数前缀：`0o660`,`0O660`

- 十六进制浮点数：`0x1.0p-1021`,`0X1.0p-1021`，幂的基数为2

- 位分离器：`1_000`

## 1.14

### 模块

模块功能已经成熟，[迁移指南](https://blog.golang.org/migrating-to-go-modules)。

## 1.18

### 泛型

添加了[泛型](https://go.dev/doc/go1.18#language)。

## 1.20

### 切片到数组的转换

```go
x := make([]byte, 4)
var array = *(*[4]byte)(x) //[4]byte
```

## 1.21

### 内建函数

[go1.21](https://go.dev/doc/go1.21) 增加：

- `max()`
- `min()`
- `clear()`，`slice`清零或者`map`清空

### 核心库

增加：

- `slog`，标准库的结构化日志实现
- `maps`，`map`的辅助功能
- `slices`，`slice`的辅助功能

## 1.22

### for语法改进

for语法有两个改进：

- 当前迭代变量每个迭代周期重写创建，避免共享异常（主要是闭包捕获）
- 支持`for range n`的整数迭代语法

第一个语法改进原则上属于**破坏性更新**，但由于更新前的语法行为是不确定性的（因此没有使用场景），因此又属于**Bug修复**。

可以写一段简单的代码来测试：

```go
func main() {
	var count atomic.Uint32
	for i := 0; i < 10; i++ {
		go func() {
			time.Sleep(1 * time.Second)
			fmt.Print(i," ")
			count.Add(1)
		}()
	}

	for {
		if count.Load() == 10 {
			break
		}
		time.Sleep(1 * time.Second)
	}
}
// > go1.21.7.exe run .\main.go
// 10 10 10 10 10 10 10 10 10 10
// > go run .\main.go
// 9 1 7 2 8 5 6 4 0 3
```

新的`go for range`语法如下：

```go
func main() {
	for i := range 10 {
		fmt.Print(i, " ")
	}
}
// > go run .\main.go
// 0 1 2 3 4 5 6 7 8 9
```

迭代结果为0~n-1的数字，不支持step(Python)，也不支持起点(Rust)。