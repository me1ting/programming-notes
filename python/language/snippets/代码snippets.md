# 代码snippets

## 如何实现代码换行？

在python中，我们想写出如下代码，但是编译器不通过：

```python
if condtion_a
	or condition_b
	or condition_c:
		pass
```

这种语法是我们在其它语言中常见的，但是在python中是不合法的，应该使用`尾部换行转义`：

```python
if condtion_a \
	condition_b \
	condition_c:
		pass
```
