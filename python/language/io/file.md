# 概览

Python中的[file](https://docs.python.org/zh-cn/3/glossary.html#term-file-object)概念比较复杂，文档中并没有一个API说明，没有明确的`接口`抽象其概念，没有明确的类型。只有一个全局`open()`函数，一些模板代码。

# 打开和关闭文件

使用`open()`函数打开文件，这是一个类C风格的函数，需要指定：

- 文件路径
- 模式，如读、写、追加等等（具体参考API说明），特别是使用**文本还是二进制模式**读写数据
- 文本模式下，需要**指定编码**，否则会使用默认编码（与系统相关）

使用完后需要关闭文件，回收资源，使用`file.close()`方法。



由于可能抛出**异常**的原因，为了安全的关闭文件，python提供了类似Java中`try with resource`结构的`with as`结构：

```python
with open("test.txt", encoding = 'utf-8') as f:
   pass
```

# 读写文件

## 读取所有内容

```python
all_content = file.read()
```

//more

# Refs

Python Tutorial: Reading and Writing Files https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files