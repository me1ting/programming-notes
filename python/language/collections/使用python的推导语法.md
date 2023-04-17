# 简介
python的`推导`语法是一个功能类似**函数式集合操作**，但比函数式操作更加简单的语法。

>python并没有像Java那样照搬一套函数式风格的语法，那是因为python的语言本身已经足够灵活，不需要一模一样的函数式API。

例如，我们想要对数据进行过滤：
```python
a = range(0, 100)
evens = [n for n in a if n % 2 == 0]
```

# Refs
《Python基础教程3》