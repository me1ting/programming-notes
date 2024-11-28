# Go迭代器详解

## 背景知识

迭代器是现代编程语言的通用功能，迭代器提供了一个遍历集合中所有元素的**标准化方法**。

Go在添加了泛型后，顺势添加迭代器也就成了理所应当的事情。
### 内部迭代器和外部迭代器

从设计模式的角度来讲，迭代器根据风格可以分为：

- 内部迭代器，函数式风格，使用者提供回调函数，比如`forEach(callback)`
- 外部迭代器，过程式风格，使用者可以手动控制迭代过程：手动调用next(),hasNext()

现代编程语言通常都支持这两种迭代器。

内部迭代器的实现很简单，就是对所有元素进行遍历，并对每个元素使用一次回调函数。外部迭代器的实现比较复杂，一些语言提供`生成器`来简化实现。
### 外部迭代器与生成器

#### 迭代器对象

外部迭代器通常实现为一个类/对象/结构体，一个迭代器对象的是一个具有以下API的对象：

- `next()`，返回下一个元素
- `hasNext()`，返回是否有下一个元素，用于判断是否到达末尾

```js
// 返回一个整数range迭代器，范围为[start,end]，步进为step
function rangeIterator(start = 0, end = Infinity, step = 1) {
  let nextIndex = start;
  let iterationCount = 0;

  const rangeIterator = {
    next() {
      let result;
      if (nextIndex < end) {
        result = { value: nextIndex, done: false };
        nextIndex += step;
        iterationCount++;
        return result;
      }
      return { value: iterationCount, done: true };
    },
  };
  return rangeIterator;
}
```

迭代器对象的优点在于其定义和使用很直观，不需要额外的心智负担，缺点是需要维护内部状态，记录当前的迭代位置，对于一些复杂场景，比如树的迭代器，实现起来比较麻烦。

#### 生成器

JavaScript和Python支持`生成器`，它往往具有特殊的语法：内部使用`yield`关键字(JavaScript,Python)，使用特殊的函数关键字`function*`(JavaScript)...

```js
// JS的生成器函数的返回值被自动包装为迭代器对象
function* rangeIterator(start = 0, end = Infinity, step = 1) {
  let iterationCount = 0;
  for (let i = start; i < end; i += step) {
    iterationCount++;
    yield i;
  }
  return iterationCount;
}
```

生成器具有与迭代对象类似的效果：

- 在JavaScript中，生成器的返回值被自动包装为迭代器对象
- 在Python中，[生成器](https://wiki.python.org/moin/Generators)具有不同于迭代器的类型，但在大部分场景可以替代迭代器

生成器简化了编写迭代器：只需要对所有元素进行一次遍历。它的缺点在于引入了`yield`关键字，而且存在心智负担，因为生成器的执行逻辑与使用迭代器的逻辑是两个交错的执行流（即`协程`）。
## Go的迭代器

Go的迭代器设计不同于其它编程语言，首先，Go开发人员认为内部迭代器使用场景多于外部迭代器，因此只标准化了`内部迭代器`，在`iter`包中定义了2个标准迭代器类型：

```go
type Seq[V any] func(yield func(V) bool)
type Seq2[K, V any] func(yield func(K, V) bool)
```

`iter`包提供了`Pull()`,`Pull2()`函数，可以将一个`内部迭代器`转换为`外部迭代器`。

>Go设计团队使用`push iterator`术语来描述内部迭代器，因为它将元素push到yield函数中。使用`pull iterator`术语来描述迭代器对象，因为它从iterator中pull元素。

### for range是如何支持内部迭代器

正如Java的`for each`对于外部迭代器的支持，Go的`for range`对于内部迭代器的支持，也是通过编译器[代码重写](https://go.googlesource.com/go/+/refs/heads/master/src/cmd/compile/internal/rangefunc/rewrite.go)来实现的。例如：

```go
for x := range f {
	fmt.Println(x)
}
```

被重写为：

```go
f(func(x T) bool {
	fmt.Println(x)
})
```

对迭代器`f`的`for range`操作，被重写为对迭代器函数`f`的调用。

### `Pull()`,`Pull2()`的实现原理

`Pull()`的原理其实就是生成器的原理，基于`协程`实现。

## 实现迭代器

### 基本原则

以下介绍在实现迭代器时的基本原则，大部分原则都是跨编程语言的。

对于集合类型，Go习惯使用`All`函数来表示迭代所有值的迭代器：

```go
func (s *Set[V]) All() iter.Seq[V]
```

命名是灵活的，可以根据需要定义多个迭代器：

```go
// 返回国家的所有城市的迭代器
func (c *Country) Cities() iter.Seq[*City]

// 返回国家的所有语言的迭代器
func (c *Country) Languages() iter.Seq[string]
```

可以使用参数来构造迭代器：

```go
// 返回key值位于 [min,max] 之间的所有KV对的迭代器
func (m *Map[K, V]) Scan(min, max K) iter.Seq2[K, V]
```

可以提供多种迭代顺序的迭代器：

```go
// 返回list从头到尾的迭代器
func (l *List[V]) All() iter.Seq[V]

// 返回list从尾到头的迭代器
func (l *List[V]) Backward() iter.Seq[V]
```

### 实现细节

内部迭代器的实现很简单，就是对元素进行一次遍历：

```go
type Slice[E any] []E

func (s *Slice[E]) All() iter.Seq[E] {
	return func(yield func(E) bool) {
		for _, v := range *s {
			if !yield(v) {
				return
			}
		}
	}
}

func (s *Slice[E]) Enumerate() iter.Seq2[int, E] {
	return func(yield func(int, E) bool) {
		for i, v := range *s {
			if !yield(i, v) {
				return
			}
		}
	}
}
```

## 使用迭代器

### 使用for range

为了配合迭代器，`for range`语法添加了支持对以下函数的迭代：

```go
func(yield func() bool)
func(yield func(V) bool)
func(yield func(K, V) bool)
```

其中后两种是标准迭代器。使用迭代器最常用的形式是使用`for range`语法：

```go
func main() {
	var slice Slice[int] = []int{1, 2, 3}

	for v := range slice.All() {
		fmt.Print(v)
	}

	for i, v := range slice.Enumerate() {
		fmt.Println(i, v)
	}
}
```

### 使用Pull()

某些场景可能需要外部迭代器。

## 参考资料

[doc: Go 1.23 Release Notes](https://go.dev/doc/go1.23)<br/>
[doc: iter 包](https://pkg.go.dev/iter)<br/>
[blog: Go中的迭代器](https://bitfieldconsulting.com/posts/iterators)<br/>
