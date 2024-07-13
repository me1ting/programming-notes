# unicode examples

## 读取utf16文本

使用用如下的代码来读取utf16数据，根据实际情况选择字节顺序和BOM：

```go
data = []byte{} //unicode16数据
utf8bytes, err := unicode.UTF16(unicode.LittleEndian, unicode.IgnoreBOM).NewDecoder().Bytes(data) //这里使用小端，无BOM
str := string(utf8bytes) //字符串
```

