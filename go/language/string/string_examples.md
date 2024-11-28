# string examples

## 判断字符串是否是纯ASCII

根据stackoverflow测试，迭代字节比迭代字符效率更高，因为不需要做额外的转换。

由于UTF8的性质，迭代字节是正确的。

```go
func isASCII(s string) bool {
    for i := 0; i < len(s); i++ {
        if s[i] > unicode.MaxASCII {
            return false
        }
    }
    return true
}
```
