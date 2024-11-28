# XML的编码和解码

## 解码

使用[Unmarshal](https://pkg.go.dev/encoding/xml#Unmarshal)方法进行解码。

由于 Unmarshal 使用 Reflect 包，因此它只能分配给导出的（大写）字段，并且区分大小写。

类似JSON，Unmarshal 也使用到结构体的字段的标签：

- 可以指定别名
- `,attr`（注意包括`,`）标签表明这是一个属性值，如`xml:",attr"`
- 