# 什么是eol问题？
`eol`是`end of line`的缩写，由于历史原因，Windows使用`\r\n`作为文本文件行结尾，而Linux与Macos使用`\n`做行结尾。

这里的`使用`，是指所有处理文本的`编程库`、`官方软件`、`第三方软件`的默认行为，而这些默认行为通常被忽略，难以察觉。

文本文件如果使用不同的eol会污染代码库提交记录，同时eol一致性也是代码风格一致性的一部分。

git一开始是为Linux开发设计，其默认的`eol`是`\n`。开源项目也通常默认`eol`为`\n`，因此**eol问题主要是在Windows上进行开发所带来的问题**。

git对此提供了一些解决方案。

# 全局设定
[core.eol](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreeol)属性用于设定在工作目录中文本文件使用的`eol`，可以设置为`lf`,`crlf`,`native`（指平台原生），默认为`native`。

[core.autocrlf](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreautocrlf)用于设定是否是否在检出和提交代码时进行转换，转换细节见后续测试。可以设置为`true`,`false`,`input`，`input`指只有提交时才进行切换，默认值为false。在Windows上安装官方版git时，GUI的默认选项是`true`（该配置文件位于`{git_home}/etc/gitconfig`）。Windows版本 github自带的git，其值也是`true`。

# 仓库设置
`.gitattributes`文件用于指定repo级别的git设置。我在Windows上测试得到如下数据：
```
* text=auto eol=lf             crlf over crlf 无提示
* text=auto eol=lf               lf over crlf 无提示
* text=auto eol=crlf             lf over crlf 提示，会转换为crlf
* text=auto eol=lf             crlf over lf   提示，会转换为lf
* text=auto eol=crlf           crlf over lf   无提示
* text=auto          checkout -f lf to crlf
* text=auto eol=crlf checkout -f lf to crlf
* text=auto eol=lf   checkout -f lf to lf
* text=auto eol=lf   checkout -f crlf to lf   失败，文件为crlf
```

# 怎么做
考虑`\n`是主流，在Windows上我们很难避免在工作目录中引入`\r\n`文件，比如脚本生成的代码、比如复制粘贴的代码，比如使用文本编辑器创建的代码，因此最好全局设置`core.autocrlf`的值为`true`或者`input`。

如果确实需要工作目录也保证是`\n`，那么需要第三方软件，比如web项目使用prettier在提交前进行格式化。项目级别的`* text=auto eol=lf`是有效的，但是在Windows平台上只能实现提交时的自动切换，而无法做到检出时的自动切换。