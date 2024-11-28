# 问题

在使用`pip install`方式安装python第三方库wordcloud时，出现了如下错误：

```
error: Microsoft Visual C++ 14.0 is required
```

# 分析

wordcloud部分使用了C/C++来编写，需要使用MSVC来编译得到`dll`或`exe`文件。

# 解决

安装MSVC，或者下载预编译的第三方库。

## 下载预编译的库

在[网站](https://www.lfd.uci.edu/~gohlke/pythonlibs/)搜索并下载合适的编译版本：

下载完成后使用`pip install`命令进行安装：

```
pip install wordcloud-1.4.1-cp36-cp36m-win_amd64.whl
```
