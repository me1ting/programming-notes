# 概念

几个热门的动态语言都有`in`操作符，但是语义不同，因此值得拿出来区分。

# Python中的`in`操作符

在Python中，`in`用来测试`成员关系`：

- 元素是否存在于`可迭代类型`中
- 元素是否存在于`序列`中
- 切片是否存在于`文本序列`、`字节序列`中
- 元素是否存在于`set`中，key是否存在于`dict`

Python支持对`in`进行符号重载，如果确实需要重载，最好保证语义与上述相同。

可以看到，Python对`in`操作符的语义定位是自然的、合理的，不需要额外的记忆负担。

# Ref

https://docs.python.org/3/reference/expressions.html#membership-test-operations

https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range
