# 概览

使用`JavaScript`的`Map`时应当注意的问题。

# Map相关的操作符

> 一句话：JavaScript没有为`Map`类型提供任何语法支持。

与其它动态语言或语法较新的语言相比（比如Python,Golang），`JavaScript`并没有将`Map`类型语法化，未提供特别的语法支持。

特别是在Python中常见的操作：

```python
d = {"key1":"value1"}
v1 = d["key1"]
exist = "key1" in d
```

在`JavaScript`中都是不支持的，**只能通过API实现**。



需要注意的是，**这些符号都被分配给了`Object`的属性操作**：

```javascript
let o = {"params1":"value1"};
let v1 = o["params1"];
let exist = "params" in o;
```



