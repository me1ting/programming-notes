# yarn的零安装

当我们clone一个项目或者切换分支，使用`install`时，会重新解析依赖，处理依赖。这个过程是耗时的、容易出错的。

[零安装](https://yarnpkg.com/features/zero-installs)就是设计用来避免这个问题，通过将依赖文件同步到代码仓库中。

## gitignore设置

yarn的`.gitignore`设置参考[文档说明](https://yarnpkg.com/getting-started/qa#which-files-should-be-gitignored)，根据是否使用`零安装`来选择一种。
