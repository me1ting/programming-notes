# 使用全局匿名变量验证接口实现
golang使用鸭子类型，但有时我们可能需要保证类型确实实现了特定接口。

使用以下方式可以实现编译阶段的接口实现验证：
```go
type cachedWriter struct {
	gin.ResponseWriter
	status  int
	written bool
	store   persistence.CacheStore
	expire  time.Duration
	key     string
}

// 验证cacheWriter实现了gin.ResponseWriter接口
var _ gin.ResponseWriter = &cachedWriter{}
```

只是不知道验证代码是否会在编译阶段被删除，因为其可能对程序的性能产生影响。

参考链接：https://go.dev/doc/faq#guarantee_satisfies_interface

