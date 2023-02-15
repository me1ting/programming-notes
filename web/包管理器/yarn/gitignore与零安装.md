# 零安装
对于新clone的一个项目，使用`yarn insall`来安装其相关依赖。但是，依赖问题是可能出现的，可能是因为一些以来升级了版本，也可能是其它原因。

[零安装](https://yarnpkg.com/features/zero-installs)就是设计用来避免这个问题，通过为存储库添加额外的文件来实现。

# gitignore设置
yarn的`.gitignore`设置参考[文档说明](https://yarnpkg.com/getting-started/qa#which-files-should-be-gitignored)，根据使用使用`零安装`来选择一种。