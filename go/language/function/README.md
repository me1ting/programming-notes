# 编写调用自身的函数
首先我尝试编写递归函数变量：
```go
func main() {
    call := func(n int){
        if n > 0 {
            fmt.Println(n)
            call(n - 1) // 编译器会报错
        }
    }
}
```
我当时以为是语言的限制，导致无法编写递归函数变量，但实际上是可以的，只需要这样做：
```go
func main() {
    var call func (int)
    call = func(n int){
        if n > 0 {
            fmt.Println(n)
            call(n - 1)
        }
    }
}
```