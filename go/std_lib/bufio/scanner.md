# scanner是如何处理文本中不同的换行符

Scanner的行分隔符兼容主要由`dropCR`驱动：

```go
// 先使用`\n`分割行，再丢弃末尾的`\r`，该函数用于后者
func dropCR(data []byte) []byte {
	if len(data) > 0 && data[len(data)-1] == '\r' {
		return data[0 : len(data)-1]
	}
	return data
}
```
