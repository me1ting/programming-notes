# Gin的基本使用

## 数据绑定

https://gin-gonic.com/docs/examples/binding-and-validation/

Gin支持绑定：

- 请求参数，使用`form`声明
- form，使用`form`声明
- url编码的form，使用`form`声明
- json，使用`json`声明
- xml，使用`form`声明
- url，使用`url`声明

需要注意，为了支持绑定，需要在数据对象上进行相应的声明：

```go
type Login struct {
	User     string `form:"user" json:"user" xml:"user"  binding:"required"`
	Password string `form:"password" json:"password" xml:"password" binding:"required"`
}
```