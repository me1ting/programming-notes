# 进一步了解error

在《tgpl》中，我们简单的了解了`error`，但是关于error的具体用法并没有进一步介绍。

## error 类型

error是一个内建的接口类型，其定义如下：

```go
type error interface {
    Error() string
}
```

error的基本接口时返回**一段字符串表示的错误消息**。

## 创建error

最简单的error创建方式是基于错误消息：

```go
import errors
import fmt

errors.New("message1")
fmt.Eprintf("message2 %v", some)
```
