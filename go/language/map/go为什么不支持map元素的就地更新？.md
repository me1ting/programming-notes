# go为什么不支持map元素的就地更新？

## 什么是map元素的就地更新？

我是在这个[博客](https://tonybai.com/2023/04/02/map-element-types-support-in-place-update/)了解到`就地更新`的概念，更近一步的出处为[《Go Fundamentals》](https://gopherguides.com/golang-fundamentals-book)。比如：

```go
count := map[string]int{}
count["hello"]++ //这就是就地更新
fmt.Println(count["hello"]) //1
```

上述例子编译得到的汇编代码，获取了`count["hello"]`的地址，然后执行加1。

## struct不支持就地更新

目前版本的Go，结构体不支持就地更新：

```go
type Count struct {
    N int
}

count := map[string]Count{}
count["hello"].N++ //不支持这样做
```

其实，不支持struct的就地更新对于使用者没什么影响，我们可以明确的表达想要的逻辑：

```go
count := map[string]Count{}
theCount := count["hello"]
theCount.N++
count["hello"] = theCount
```

## struct为什么不支持就地更新？

相关讨论在[issue 3117](https://github.com/golang/go/issues/3117)进行，个人看了下，并没有什么值得关注的观点。

个人认为，`count["hello"]++`是可以理解的，人们预期其效果为：

```go
count["hello"] += 1
```

但是`count["hello"].N++`其代表的行为让人困惑：

```go
c := count["hello"]
c.N++
count["hello"] = c
```

这并不值得专门为此发明一个语法糖，然后几乎没人使用。

## 总结

一个没什么价值的Go的map的语法讨论，这里仅作记录。