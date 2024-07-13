# 验证CPU乱序执行

使用如下Go代码，可以验证CPU是乱序执行的。

```go
import (
	"os"
	"sync"
)

func main() {
	cmd := os.Args[1]
	count := 0

out:
	for {
		x, y, a, b := 0, 0, 0, 0
		count++
		var wg sync.WaitGroup
		wg.Add(2)
		go func() {
			a = 1
			x = b
			println("goroutine1 done ", count)
			wg.Done()
		}()
		go func() {
			b = 1
			y = a
			println("goroutine2 done ", count)
			wg.Done()

		}()
		wg.Wait()
		switch cmd {
		case "1":
			if x == 0 && y == 0 {
				break out
			}
		case "2":
			if x == 0 && y == 1 {
				break out
			}
		case "3":
			if x == 1 && y == 0 {
				break out
			}
		case "4":
			if x == 1 && y == 1 {
				break out
			}
		}
	}

	println("执行次数 ：", count)
}
```

将以上代码编译，然后分别执行：

```
./main.exe 1
./main.exe 2
./main.exe 3
./main.exe 4
```

如果以上命令在多线程CPU下均能正常退出，那么CPU确实是乱序执行的。

## 原理分析

我们使用了两个goroutine，分别执行：

|1|2|
|--|--|
|a = 1|b = 1|
|x = b|y = a|

我们给以上指令分配id：

- a = 1, 使用id 1
- x = b, 使用id 2
- b = 1, 使用id 3
- y = a, 使用id 4

首先我们不考虑编译器指令重排，假设：

- 第一个goroutine的执行顺序是：1,2 
- 第二个goroutine的执行顺序是：3,4

要保证`./main.exe 1`成功退出，要求xy的值为00，那么要求执行顺序：2 -> 3, 4 -> 1
要保证`./main.exe 2`成功退出，要求xy的值为01，那么要求执行顺序：2 -> 3, 1 -> 4
要保证`./main.exe 3`成功退出，要求xy的值为10，那么要求执行顺序：3 -> 2, 4 -> 1
要保证`./main.exe 4`成功退出，要求xy的值为11，那么要求执行顺序：3 -> 2, 1 -> 4

*使用符号`->`表示先执行*

我们可以看到`./main.exe 1`要求 `2 -> 3`，那必然可以得出`1 -> 4`与实际测试结果相违背。

因此，我们验证了CPU是乱序执行。

### 编译器指令重排

编译器可能会打乱指令的运行顺序，但是**编译后的顺序是确定的**。因此不影响我们得出的结果。

比如，我们假设编译后的指令顺序为`2 -> 1`,`4 -> 3`，那么`./main.exe 4`的测试结果违背了这个顺序。

## 参考资料

[blog: cpu乱序执行验证demo](https://fanlv.fun/2020/06/09/golang-memory-model/#2-2-1-CPU-%E6%8C%87%E4%BB%A4%E4%B9%B1%E5%BA%8F%E6%89%A7%E8%A1%8C%E9%AA%8C%E8%AF%81-Demo)
