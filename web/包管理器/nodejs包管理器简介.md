# nodejs包管理器

包管理器是一门成熟的编程语言必备的工具链之一，nodejs目前主要有以下包管理器：

- npm
- yarn
- pnpm

# npm

`npm`是`nodejs`目前的官方包管理器，由三部分组成：

- 相关站点，提供文档查阅、包查阅等功能
- 注册表，一种包管理器所使用的特定数据库
- CLI工具，命令行客户端工具，是开发者最关心的部分

# yarn

`yarn`是一个CLI工具，是Facebook用来取代npm的产物。`yarn`沿用npm的部分基础设施，目前`yarn`已经使用了独立的注册表。

## pnpm

pnpm是`performan npm`的缩写，其最初目的是解决`npm`所带来的[存储空间浪费](https://pnpm.io/zh/motivation#%E8%8A%82%E7%9C%81%E7%A3%81%E7%9B%98%E7%A9%BA%E9%97%B4)，通过在每个磁盘分区下面创建一个公共仓库，使用`硬链接`共享依赖中的文件，使用`软链接`来兼容现有的node_modules结构。
