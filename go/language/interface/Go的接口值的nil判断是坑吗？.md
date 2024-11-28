# Go的接口值的nil判断是坑吗？

当你入门Go的时候，教程通常向你强调Go的接口值底层包括两个部分：动态类型和动态值。接口值只有在类型和值同时不存在时，才`==nil`。

然后你逐渐开始使用Go，然后你几乎忘了上面的概念，直到有一天，你又回忆起这个概念，你猛然惊醒，这么重要的概念我为什么会遗忘，我有没有因此写出过错误的代码？

## 遗忘是正常的

编程语言本质上是工具，工具用的多就熟悉，用的少就遗忘，上述概念就是这样，因为在编码过程中我们通常不需要心智负担去考虑这件事，因此很快遗忘。

## 通常不会因此写出错误的代码

可以想象一下什么场景会使用接口？我们定义了一个接收接口的方法/函数，在内部，我们调用接口的方法：

```go
type Worker interface {
	doSomethingReally()
}

func doSomething(w Worker){
	if in != nil {
		w.doSomethingReally()
	}
}
```

接口的调用约定就是其方法，而Go中nil是合法的方法接收者（需要调用方保证），这意味着在上述代码中，我们根本需要考虑类型不为空但值为nil的情况。

另一种使用接口的情况是，我们会进行类型断言或类型分支：

```go
type WorkerTypeA struct {
}

func (w *WorkTypeA)doSomethingReally(){
	//impl
}

func doSomething(w Worker){
	if in == nil {
		return
	}

	s, ok := i.(*WorkerTypeA){
		if s == nil {
			return
		}
		//此时s是确切类型WorkerTypeA的实例
	}
}
```

存在一种可能，如果我们在断言指针类型成功后取消对结果值`==nil`检测，可能导致错误的代码。因此通常来说，不会因为这个设计而写出错误代码，但不能完全避免。

## 附录1：测试代码

```go
package main

import (
	"fmt"
)

type MyError struct{}

func (e MyError) Error() string {
	return "This is my error"
}

type MyError2 struct{}

func (e *MyError2) Error() string {
	return "This is my error2"
}

var _ error = MyError{}
var _ error = &MyError2{}

func PrintError(e error) {
	if e == nil {
		fmt.Println("nil")
		return
	}

	switch e := e.(type) {
	case MyError:
		fmt.Printf("MyError: %s\n", e)
	case *MyError2:
		if e == nil {
			fmt.Println("MyError2: nil")
		} else {
			fmt.Printf("MyError2: %s\n", e)
		}
	default:
		fmt.Println(e)
	}
}

func main() {
	PrintError(MyError{})
	PrintError(&MyError2{})

	var e *MyError2
	PrintError(e)
}
```