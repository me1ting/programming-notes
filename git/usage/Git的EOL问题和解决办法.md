# Git的EOL问题和解决办法
## 什么是EOL问题？

`EOL`是`end of line`的缩写，由于历史原因，Windows使用`\r\n`作为文本文件行结尾，而Linux与MacOS使用`\n`作为行结尾。

这里的`使用`，是指处理文本的`编程库`、`官方软件`、`第三方软件`的默认行为，而这些默认行为很难甚至无法修改。

项目中的文本文件使用不同的EOL会污染代码库提交记录，同时EOL一致性也是代码风格一致性的一部分。

Git对此提供了解决方案。

## 设定
### 全局设定

Git的全局配置文件位于安装目录下的`/etc/gitconfig`。

[core.eol](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreeol)属性用于设定（仅影响`autocrlf`）在工作目录中文本文件使用的`EOL`，可以设置为`lf`,`crlf`,`native`（平台原生），默认为`native`。

[core.autocrlf](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreautocrlf)用于设定当工作目录中文件的EOL与EOL设定不同时，是否在检出和提交代码时进行转换。可以设置为`true`,`false`,`input`，`input`指只有提交时才进行切换，默认值为`false`。在Windows上，Git安装包的默认选项是`true`， github desktop 自带的Git，其值也是`true`。

### 仓库设置

`.gitattributes`文件用于指定repo级别的Git设置，以下设定repo的EOL：

```
# 通配符表示所有文件 自动识别文本 EOL为lf
* text=auto eol=lf
```

这表示由 git 检查所有文件，判断其是否为文本，文本的EOL设定为lf。

但是，`.gitattributes`本身并不会被Git视作文本文件，所以需要指定：

```
.gitattributes text eol=lf
```

### 实际效果

当`autocrlf`生效时，提交时检测到本地文件的EOL与设定不一致，会进行转换。
## 经验

对于一个仓库，在写代码前就应该想好是面向Windows还是面向Linux/macOS（以及跨平台），前者使用`crlf`，后者使用`lf`，**需要添加仓库级别的EOL设置**。

因为各种原因（比如脚本生成的代码文件、比如复制粘贴的代码文件，比如使用文本编辑器创建的代码），工作目录总是无法避免引入具有与设定不一致的EOL的文件。

可用使用第三方软件来格式化，比如Web项目使用prettier在提交前进行格式化。

## 案例

### Go语言源码仓库

使用了内容如下的`.gitattributes`：

```
# Treat all files in the Go repo as binary, with no git magic updating
# line endings. This produces predictable results in different environments.
#
# Windows users contributing to Go will need to use a modern version
# of git and editors capable of LF line endings.
#
# Windows .bat files are known to have multiple bugs when run with LF
# endings, and so they are checked in with CRLF endings, with a test
# in test/winbatch.go to catch problems. (See golang.org/issue/37791.)
#
# We'll prevent accidental CRLF line endings from entering the repo
# via the git-codereview gofmt checks and tests.
#
# See golang.org/issue/9281.

* -text
```

`* -text`表示将所有文件视作非文本文件（即二进制文件）。

Go语言的源码大部分以`\n`结尾，但是Windows平台的`.bat`脚本以`\r\n`结尾，否则会出错。因此Go语言的源码是混合EOL的仓库，使用现代Git提供的配置选项也能办到，但Go团队放弃使用Git的解决方案（可能是历史原因）。

Go源码对于EOL的标准化是通过第三方工具保证的。