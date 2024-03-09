# 我眼中的Python

Python是一门火热的、上手容易的编程语言，这里记录一下我对Python这门编程语言的看法。

## Python的学习难度

Python是一门入门很简单的编程语言，但是由于其语法糖众多，要达到精通的难度很难。很多语法缺乏清晰的学习材料，只能遇到后再阅读相关的PEP，学习成本较高。

判断一个语言的隐形学习成本是否较高，可以通过阅读语言自身或知名开源项目源码来了解。如果这些源码大量使用了入门学习材料根本接触不到的高级特性，那么就意味着你还需要进一步学习，而学习这些高级内容很多时候没有合适的材料。Python在我眼中就是这样的一门语言。

## Python的文档

Python的文档给我一种杂乱的感觉：

- 由于缺乏类型，Python的文档中使用大量的文字去补充API缺乏的表达能力
- API不够稳定，使得文档混杂着许多版本变更说明

以zlib功能为例：

Java: https://docs.oracle.com/javase/8/docs/api/java/util/zip/Inflater.html
Go: https://pkg.go.dev/compress/zlib
Python: https://docs.python.org/zh-cn/3/library/zlib.html

可以看出Python的文档相比之下难以阅读。

## 我对Python的定位

Python是一门通用型语言，理论上可以用来编写所有不限定计算机语言的应用。

但实际情况是，Python目前主要有两个热门用途：

- 机器学习
- 爬虫

这两个方向目前我都没有接触。因此，现在我只是将Python作为一门脚本语言，用来编写读写文件、数据库、网络的简单脚本。

由于缺乏类型约束，使用Python来编写模块化的程序，个人的体验是不如Go的。
