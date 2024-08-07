# encoding/binary examples

## 数字编码和解码

### byte[]转换为有符号数函数

`BigEndian`与`LitterEndian`没有提供有符号数的API，但用强制类型转换，然后用无符号数API进行读写。

```go
func main() {
	buffer := []byte{}

	num := -1
	unum := uint32(num) //4294967295
	buffer = binary.LittleEndian.AppendUint32(buffer, unum)

	unum = binary.LittleEndian.Uint32(buffer) //4294967295
	num = int32(unum) //-1
}
```

#### 存在的陷阱

这里可能存在一个陷阱，比如下面这个函数中：

```go
func main() {
	buffer := []byte{}

	num := -1
	unum := uint32(num) //4294967295
	buffer = binary.LittleEndian.AppendUint32(buffer, unum)

	unum = binary.LittleEndian.Uint32(buffer) //4294967295
	num = int(unum)                           //4294967295
}
```

如果存储的`-1`，函数却返回`4294967295`。原因是`uint32`->`int64`高位补0，得到的是正数。

**一定要以相同长度的类型进行存储和取出数据**。
### 浮点数的二进制转换

需要自己封装。

```go
package binaryutil

import (
	"bytes"
	"encoding/binary"
)

var LittleEndian littleEndian

type littleEndian struct{}

func (littleEndian) Float32(b []byte) (float32, error) {
	_ = b[4] // bounds check hint to compiler; see golang.org/issue/14808
	var n float32
	buf := bytes.NewReader(b)
	err := binary.Read(buf, binary.LittleEndian, &n)
	return n, err
}
```

#### 使用指针（不推荐）

可以使用unsafe得到float32的指针，并强制转换为uint32。

```go
func main() {
	var pi float32 = 3.141592653589793
	bytes := make([]byte, 4)
	binary.BigEndian.PutUint32(bytes, *(*uint32)(unsafe.Pointer(&pi)))

	for _, b := range bytes {
		fmt.Printf("%02x", b) //40490fdb
	}
}
```