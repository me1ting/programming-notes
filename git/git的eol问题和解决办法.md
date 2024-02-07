# git的eol问题和解决办法
## 什么是eol问题？

`eol`是`end of line`的缩写，由于历史原因，Windows使用`\r\n`作为文本文件行结尾，而Linux与Macos使用`\n`做行结尾。

这里的`使用`，是指所有处理文本的`编程库`、`官方软件`、`第三方软件`的默认行为，而这些默认行为是潜移默化的，很难甚至无法修改。

项目中的文本文件使用不同的eol会污染代码库提交记录，同时eol一致性也是代码风格一致性的一部分。

git对此提供了一些解决方案。

## 设定
### 全局设定

[core.eol](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreeol)属性用于设定（仅对后续的autocrlf产生影响）在工作目录中文本文件使用的`eol`，可以设置为`lf`,`crlf`,`native`（指平台原生），默认为`native`。

[core.autocrlf](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreautocrlf)用于设定当工作目录的eol与仓库的eol设定不同时，是否在检出和提交代码时进行转换。可以设置为`true`,`false`,`input`，`input`指只有提交时才进行切换，默认值为false。在Windows上安装官方版git时，GUI的默认选项是`true`（该配置文件位于`{git_home}/etc/gitconfig`）。Windows版本 github desktop 自带的git，其值也是`true`。

### 仓库设置

`.gitattributes`文件用于指定repo级别的git设置，以下设定工作目录使用的eol：

```
* text=auto eol=lf
```

注意，`.gitattributes`本质是一个配置文件，在使用`git`命令时，会读取这个配置文件，改变一些行为。也就是说，`.gitattributes`并不会因为你commit到仓库才生效。

### 实际效果

这是我之前的一些测试：

```
* text=auto eol=lf             crlf overwrite crlf 无提示
* text=auto eol=lf               lf overwrite crlf 无提示
* text=auto eol=crlf             lf overwrite crlf 提示，会转换为crlf
* text=auto eol=lf             crlf overwrite lf   提示，会转换为lf
* text=auto eol=crlf           crlf overwrite lf   无提示
```

总结如下：

- eol设定不存在强制效果，只会在提交时当本地文件的eol与设定和存档均不一致时才提示转换
- 如果本地文件的eof与存档的eof一致，即使违背了eol设定，那么git不会提示也不会转换

## 经验

对于一个仓库，在写代码前就应该想好是面向Windows还是面向Linux/Macos（以及跨平台），前者使用`crlf`，后者使用`lf`，**需要添加仓库级别的eol设置**。

因为各种原因（比如脚本生成的代码、比如复制粘贴的代码，比如使用文本编辑器创建的代码），工作目录总是无法避免引入具有与设定不一致的eof的文件，只要**保证存档是与设定一致**的，并且**开启自动转换**，那么就不存在任何问题。

如果要保证工作目录与设定的eof一致，一些语言，可用使用第三方软件来格式化，比如web项目使用prettier在提交前进行格式化。