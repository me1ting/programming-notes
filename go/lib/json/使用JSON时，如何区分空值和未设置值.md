# 使用JSON时，如何区分空值和未设置值

逛v2的golang区时看到了这样的[问题](https://www.v2ex.com/t/975214)：

```go
type Data struct {
	Price int `json:"price"`
}

func main() {
	str := []byte(`{"price": null}`)
	var data Data
	//这里省略了检查err
	json.Unmarshal(str, &data)
	fmt.Println(data.Price)
}
// output: 0
```

假设请求端传入了包含`price`的数据，服务端要求：

- `price: 0`是有效的
- `price: null`是非法的

>price只是用来举例，这里不考虑请求端传递`price`在业务逻辑上是否合理

很多编程语言的json库支持区分空值和未设置值，但官方json库解析`price: null`与`price: 0`的结果均为0，不支持区分。

从源码得知，官方json库遇到非引用类型字段的json值为null时，不做任何处理：

https://cs.opensource.google/go/go/+/master:src/encoding/json/decode.go;l=895

```go
	switch c := item[0]; c {
	case 'n': // null
		//..
		switch v.Kind() {
		case reflect.Interface, reflect.Pointer, reflect.Map, reflect.Slice:
			v.SetZero()
			// otherwise, ignore null for primitives/string
		}
		//...
	}
```

## 解决办法

### 使用指针

可以使用指针：

```go
type Data struct {
	Price *int `json:"myName"`
}

func main() {
	str := []byte(`{}`)
	var data Data
	//这里省略了检查err
	json.Unmarshal(str, &data)
	fmt.Println(data.Price == nil)
}
//output: true
```

使用指针的问题是，数据类型与实际业务逻辑不匹配（因为我们需要的是整数而不是整数指针），导致指针污染了整个代码。

这个问题的一种解决办法是：同时提供指针版本和非指针版本的数据类型，缺点是这种方式不够优雅。

### 使用自定义`UnmarshalJSON`

细节省略

这种方法的缺点是，需要对每个遇到该问题的数据类型进行自定义方法，实现起来繁琐，容易出错。

### 修改官方库

可以修改官方库，当非引用字段的json值为null时，返回错误：

```go
	switch c := item[0]; c {
	case 'n': // null
		//..
		switch v.Kind() {
		case reflect.Interface, reflect.Pointer, reflect.Map, reflect.Slice:
			v.SetZero()
		default:
			// otherwise, return error
			return fmt.Errorf("json: cannot unmarshal null into %v", v.Type())
		}
	}
```

这种方式的优点是不需要修改应用代码。

这种方式的缺点是，你需要将`encoding/json`提取为一个新的包，当Go版本更新时同步上游，维护起来繁琐。

### 手动检查

你可以将数据同时解析为原始的`map[string]interface{}`，进行手动检查：

```go
type Data struct {
	Price *int `json:"myName"`
}

func main() {
	str := []byte(`{"price":null}`)
	var data map[string]interface{}
	//这里省略了检查err
	json.Unmarshal(str, &data)
	if price, ok := data["price"]; ok {
		fmt.Println(price == nil)
	}
}
//output: true
```

手动检查的问题是过于繁琐。
### 使用第三方json库

可以使用第三方json库，比如[go-json](https://github.com/goccy/go-json)以及[其它](https://github.com/goccy/go-json#json-library-comparison)。

虽然我没有看到这些库支持我们的需求，但是fork它们或者提issue比官方库容易得多。

### 使用特殊初始值

一种取巧的办法是使用一个特殊的初始值，比如`math.MinInt`，从而检测值是否发生变化。

这种方式的缺点是：

- 与标准json库耦合
- 特殊值处理不当，可能会引入Bug

## 总结

官方json库遇到*非引用类型字段的json值为null时不做任何处理，使用默认的零值*，该行为在某些场景产生问题。

相比增加额外的检查代码，从`json库`的角度入手是解决该问题最好的办法。

此外，官方json库还无法检测：

- json缺少某个字段，比如丢失了`price`，官方库解析结果等价为`price: null`，使用默认的零值
- json携带了多余的字段（极端的检测场景）

第一种情况的效果与本文讨论的问题差不多，同样可能在某些场景带来问题。

